import type {
    Board,
    BoxPlotData,
    Card,
    ColumnMovement,
    Course,
    LearningStrategy,
    LearningStrategyInput,
    Links,
    List,
    Log,
    ProgressReport,
    StudySession,
    StudySessionsResponse,
    User,
} from "@/types"
import { ApiError } from "@/lib/api/client"
import type { LoginResponse, MessageResponse } from "@/lib/api/auth"
import type { RealApi } from "@/lib/api"
import { COLUMN_TITLES } from "@/lib/constants"
import { DEMO_ADMIN_USER, DEMO_STUDENT_USER } from "./seeds"
import { DEMO_KEYS, getDemoItem, setDemoItem } from "./storage"

// --- Session helpers ---

function getCurrentDemoUser(): User {
    const user = getDemoItem<User | null>(DEMO_KEYS.CURRENT_USER, null)
    if (!user) throw new ApiError("No access token available", 401)
    return user
}

function findUserById(id: string): User | undefined {
    return getDemoItem<User[]>(DEMO_KEYS.USERS, []).find((u) => u._id === id)
}

function findUserByUsername(username: string): User | undefined {
    return getDemoItem<User[]>(DEMO_KEYS.USERS, []).find((u) => u.username === username)
}

// --- Auth ---

async function login(username: string, _password: string): Promise<LoginResponse> {
    const user = username.toLowerCase().includes("admin") ? DEMO_ADMIN_USER : DEMO_STUDENT_USER
    const token = `demo-token-${user.role}-${Date.now()}`
    setDemoItem(DEMO_KEYS.CURRENT_USER, user)
    setDemoItem(DEMO_KEYS.TOKEN, token)
    return { token, role: user.role }
}

async function register(): Promise<MessageResponse> {
    return { message: "Demo mode doesn't create new accounts — use the demo login buttons instead." }
}

async function logout(): Promise<MessageResponse> {
    setDemoItem(DEMO_KEYS.CURRENT_USER, null)
    setDemoItem(DEMO_KEYS.TOKEN, null)
    return { message: "Logged out successfully" }
}

async function requestReset(): Promise<MessageResponse> {
    return { message: "Password reset isn't available in demo mode." }
}

async function resetPassword(): Promise<MessageResponse> {
    return { message: "Password reset isn't available in demo mode." }
}

async function getCurrentUser(): Promise<User> {
    return getCurrentDemoUser()
}

async function updateProfile(userData: {
    first_name: string
    last_name: string
    email: string
    username: string
}): Promise<MessageResponse> {
    const current = getCurrentDemoUser()
    const updated: User = { ...current, ...userData }
    setDemoItem(DEMO_KEYS.CURRENT_USER, updated)
    const users = getDemoItem<User[]>(DEMO_KEYS.USERS, [])
    setDemoItem(
        DEMO_KEYS.USERS,
        users.map((u) => (u._id === updated._id ? updated : u))
    )
    return { message: "Profile updated successfully" }
}

async function updatePassword(): Promise<MessageResponse> {
    return { message: "Password updated successfully" }
}

// --- Board ---

function getBoardsMap(): Record<string, Board> {
    return getDemoItem<Record<string, Board>>(DEMO_KEYS.BOARDS, {})
}

function setBoardsMap(map: Record<string, Board>): void {
    setDemoItem(DEMO_KEYS.BOARDS, map)
}

async function getBoard(): Promise<Board> {
    const user = getCurrentDemoUser()
    const board = getBoardsMap()[user._id]
    if (!board) throw new ApiError("Board not found", 404)
    return board
}

async function getBoardByUser(userId: string): Promise<Board> {
    const board = getBoardsMap()[userId]
    if (!board) throw new ApiError("Board not found", 404)
    return board
}

async function updateBoard(boardId: string, lists: List[]): Promise<MessageResponse> {
    const user = getCurrentDemoUser()
    const boards = getBoardsMap()
    const board = boards[user._id]
    if (!board || board.id !== boardId) throw new ApiError("Board not found or not modified", 404)
    boards[user._id] = { ...board, lists }
    setBoardsMap(boards)
    return { message: "Board updated successfully" }
}

async function createBoard(name: string): Promise<Board> {
    const user = getCurrentDemoUser()
    const boards = getBoardsMap()
    const board: Board = { id: `demo-board-${user._id}-${Date.now()}`, name, lists: [] }
    boards[user._id] = board
    setBoardsMap(boards)
    return board
}

async function searchBoards(query: string): Promise<{ id: string; name: string }[]> {
    return Object.values(getBoardsMap())
        .filter((board) => board.name.toLowerCase().includes(query.toLowerCase()))
        .map((board) => ({ id: board.id, name: board.name }))
}

// --- Cards ---
// Card mutation (add/update/move/archive/delete) is handled entirely client-side by useBoard,
// which persists the whole board via updateBoard above — these two exist only for signature parity.

async function updateLinks(cardId: string, links: string[]): Promise<{ links: Links[] }> {
    return { links: links.map((url, i) => ({ id: `${cardId}-link-${i + 1}`, url })) }
}

async function getCardMovements(cardId: string): Promise<ColumnMovement[]> {
    for (const board of Object.values(getBoardsMap())) {
        for (const list of board.lists) {
            const card = list.cards.find((c) => c.id === cardId)
            if (card) return card.column_movements
        }
    }
    return []
}

async function createCardMovement(): Promise<MessageResponse> {
    // useBoard already appends the movement onto the card itself before calling updateBoard.
    return { message: "Movement recorded" }
}

// --- Analytics ---
// Ports backend/controllers/board_controller.py::get_progress_report so the demo dashboard
// reflects the live state of the demo board instead of a static snapshot.

interface GradeStats {
    grades: number[]
    min: number
    q1: number
    median: number
    q3: number
    max: number
    count: number
}

function emptyGradeStats(): GradeStats {
    return { grades: [], min: 100, q1: 0, median: 0, q3: 0, max: 0, count: 0 }
}

function parseGrade(value: string | undefined): number | null {
    if (!value || value.trim() === "") return null
    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? null : parsed
}

function applyQuartiles(stat: GradeStats): void {
    if (stat.grades.length === 0) return
    const sorted = [...stat.grades].sort((a, b) => a - b)
    const count = sorted.length
    stat.min = sorted[0]
    stat.max = sorted[count - 1]
    stat.count = count
    if (count >= 4) {
        stat.q1 = sorted[Math.floor(count / 4)]
        stat.median = sorted[Math.floor(count / 2)]
        stat.q3 = sorted[Math.floor((3 * count) / 4)]
    } else {
        stat.q1 = sorted[0]
        stat.median = sorted[0]
        stat.q3 = sorted[0]
    }
}

function toBoxPlot(stat: GradeStats): BoxPlotData {
    return { min: stat.min, q1: stat.q1, median: stat.median, q3: stat.q3, max: stat.max, count: stat.count }
}

async function getProgressReport(): Promise<ProgressReport> {
    const board = await getBoard()

    let totalCards = 0
    let doneCards = 0
    const listReport: Record<string, number> = {}
    const strategyStats: Record<string, { pre_test: GradeStats; post_test: GradeStats }> = {}
    const courseStats: Record<string, { pre_test: { grades: number[]; avg: number; count: number }; post_test: { grades: number[]; avg: number; count: number } }> = {}
    const strategyUsage: Record<string, Record<string, number>> = {}

    const activeCards: Card[] = []
    for (const list of board.lists) {
        const cards = list.cards.filter((c) => !c.archived && !c.deleted)
        listReport[list.title] = cards.length
        totalCards += cards.length
        if (list.title === COLUMN_TITLES.REFLECTION) doneCards = cards.length
        activeCards.push(...cards)
    }

    for (const card of activeCards) {
        const strategy = card.learning_strategy
        const titleParts = card.title.split("[")
        if (titleParts.length < 2) continue
        const courseName = titleParts[0].trim()

        if (strategy && courseName) {
            strategyUsage[strategy] ??= {}
            strategyUsage[strategy][courseName] = (strategyUsage[strategy][courseName] ?? 0) + 1
        }
        if (strategy && !strategyStats[strategy]) {
            strategyStats[strategy] = { pre_test: emptyGradeStats(), post_test: emptyGradeStats() }
        }
        if (courseName && !courseStats[courseName]) {
            courseStats[courseName] = { pre_test: { grades: [], avg: 0, count: 0 }, post_test: { grades: [], avg: 0, count: 0 } }
        }

        const preTest = parseGrade(card.pre_test_grade)
        if (preTest !== null) {
            if (strategy) strategyStats[strategy].pre_test.grades.push(preTest)
            if (courseName) courseStats[courseName].pre_test.grades.push(preTest)
        }
        const postTest = parseGrade(card.post_test_grade)
        if (postTest !== null) {
            if (strategy) strategyStats[strategy].post_test.grades.push(postTest)
            if (courseName) courseStats[courseName].post_test.grades.push(postTest)
        }
    }

    const finalStrategyStats: ProgressReport["strategy_stats"] = {}
    for (const [strategy, value] of Object.entries(strategyStats)) {
        applyQuartiles(value.pre_test)
        applyQuartiles(value.post_test)
        finalStrategyStats[strategy] = { pre_test: toBoxPlot(value.pre_test), post_test: toBoxPlot(value.post_test) }
    }

    const finalCourseStats: ProgressReport["course_stats"] = {}
    for (const [courseName, value] of Object.entries(courseStats)) {
        for (const key of ["pre_test", "post_test"] as const) {
            const stat = value[key]
            if (stat.grades.length > 0) {
                stat.avg = Math.round((stat.grades.reduce((a, b) => a + b, 0) / stat.grades.length) * 100) / 100
                stat.count = stat.grades.length
            }
        }
        finalCourseStats[courseName] = {
            pre_test: { avg: value.pre_test.avg, count: value.pre_test.count },
            post_test: { avg: value.post_test.avg, count: value.post_test.count },
        }
    }

    const topStrategies = Object.entries(strategyUsage)
        .map(([strategy, courses]) => {
            const totalUsage = Object.values(courses).reduce((a, b) => a + b, 0)
            const mostUsedIn = Object.entries(courses).sort((a, b) => b[1] - a[1])[0][0]
            return { strategy, count: totalUsage, most_used_in: mostUsedIn }
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)

    return {
        total_cards: totalCards,
        done_cards: doneCards,
        progress_percentage: totalCards > 0 ? (doneCards / totalCards) * 100 : 0,
        list_report: listReport,
        strategy_stats: finalStrategyStats,
        course_stats: finalCourseStats,
        top_strategies: topStrategies,
    }
}

// --- Admin: courses ---

async function getCourses(): Promise<Course[]> {
    const courses = getDemoItem<Course[]>(DEMO_KEYS.COURSES, [])
    return [...courses].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
}

async function createCourse(course: { course_code: string; course_name: string }): Promise<MessageResponse> {
    const courses = getDemoItem<Course[]>(DEMO_KEYS.COURSES, [])
    const newCourse: Course = { _id: `course-${Date.now()}`, ...course, created_at: new Date().toISOString() }
    setDemoItem(DEMO_KEYS.COURSES, [...courses, newCourse])
    return { message: "Course added successfully" }
}

async function updateCourse(courseCode: string, course: { course_code: string; course_name: string }): Promise<MessageResponse> {
    const courses = getDemoItem<Course[]>(DEMO_KEYS.COURSES, [])
    const index = courses.findIndex((c) => c.course_code === courseCode)
    if (index === -1) throw new ApiError("Course not found or no changes made", 404)
    courses[index] = { ...courses[index], ...course }
    setDemoItem(DEMO_KEYS.COURSES, courses)
    return { message: "Course updated successfully" }
}

async function deleteCourse(courseCode: string): Promise<MessageResponse> {
    const courses = getDemoItem<Course[]>(DEMO_KEYS.COURSES, [])
    const next = courses.filter((c) => c.course_code !== courseCode)
    if (next.length === courses.length) throw new ApiError("Course not found", 404)
    setDemoItem(DEMO_KEYS.COURSES, next)
    return { message: "Course deleted successfully" }
}

// --- Admin: learning strategies ---

async function getStrategies(): Promise<LearningStrategy[]> {
    const strategies = getDemoItem<LearningStrategy[]>(DEMO_KEYS.STRATEGIES, [])
    return [...strategies].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
}

async function getStrategy(id: string): Promise<LearningStrategy> {
    const strategy = getDemoItem<LearningStrategy[]>(DEMO_KEYS.STRATEGIES, []).find((s) => s.id === id)
    if (!strategy) throw new ApiError("Learning strategy not found", 404)
    return strategy
}

async function createStrategy(strategy: LearningStrategyInput): Promise<MessageResponse> {
    const strategies = getDemoItem<LearningStrategy[]>(DEMO_KEYS.STRATEGIES, [])
    const newStrategy: LearningStrategy = {
        id: `strategy-${Date.now()}`,
        name: strategy.name,
        description: strategy.description,
        created_at: new Date().toISOString(),
    }
    setDemoItem(DEMO_KEYS.STRATEGIES, [...strategies, newStrategy])
    return { message: "Learning strategy added successfully" }
}

async function updateStrategy(id: string, strategy: LearningStrategyInput): Promise<MessageResponse> {
    const strategies = getDemoItem<LearningStrategy[]>(DEMO_KEYS.STRATEGIES, [])
    const index = strategies.findIndex((s) => s.id === id)
    if (index === -1) throw new ApiError("Learning strategy not found", 404)
    strategies[index] = { ...strategies[index], name: strategy.name, description: strategy.description }
    setDemoItem(DEMO_KEYS.STRATEGIES, strategies)
    return { message: "Learning strategy updated successfully" }
}

async function deleteStrategy(id: string): Promise<MessageResponse> {
    const strategies = getDemoItem<LearningStrategy[]>(DEMO_KEYS.STRATEGIES, [])
    const next = strategies.filter((s) => s.id !== id)
    if (next.length === strategies.length) throw new ApiError("Learning strategy not found", 404)
    setDemoItem(DEMO_KEYS.STRATEGIES, next)
    return { message: "Learning strategy deleted successfully" }
}

// --- Admin: users ---

async function getAllUsers(): Promise<User[]> {
    const users = getDemoItem<User[]>(DEMO_KEYS.USERS, [])
    return [...users].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
}

async function getUserByUsername(username: string): Promise<User> {
    const user = findUserByUsername(username)
    if (!user) throw new ApiError("User not found", 404)
    return user
}

async function searchUserByUsername(username: string): Promise<User> {
    return getUserByUsername(username)
}

async function searchUserById(userId: string): Promise<User> {
    const user = findUserById(userId)
    if (!user) throw new ApiError("User not found", 404)
    return user
}

// --- Admin: logs ---

async function getAllLogs(): Promise<Log[]> {
    const logs = getDemoItem<Log[]>(DEMO_KEYS.LOGS, [])
    return [...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// --- Study sessions ---

function getSessionsMap(): Record<string, StudySession[]> {
    return getDemoItem<Record<string, StudySession[]>>(DEMO_KEYS.STUDY_SESSIONS, {})
}

function setSessionsMap(map: Record<string, StudySession[]>): void {
    setDemoItem(DEMO_KEYS.STUDY_SESSIONS, map)
}

function totalStudyMinutes(sessions: StudySession[]): number {
    return sessions.reduce((total, session) => {
        if (!session.end_time) return total
        const minutes = (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000
        return total + minutes
    }, 0)
}

async function getSessionsForCard(cardId: string): Promise<StudySessionsResponse> {
    const sessions = getSessionsMap()[cardId] ?? []
    return { sessions, total_study_time_minutes: totalStudyMinutes(sessions) }
}

async function startSession(cardId: string): Promise<StudySession> {
    const user = getCurrentDemoUser()
    const map = getSessionsMap()
    const session: StudySession = {
        _id: `session-${Date.now()}`,
        user_id: user._id,
        card_id: cardId,
        start_time: new Date().toISOString(),
        end_time: null,
    }
    map[cardId] = [...(map[cardId] ?? []), session]
    setSessionsMap(map)
    return session
}

async function endSession(sessionId: string): Promise<MessageResponse> {
    const map = getSessionsMap()
    let found = false
    for (const cardId of Object.keys(map)) {
        map[cardId] = map[cardId].map((session) => {
            if (session._id !== sessionId) return session
            found = true
            return { ...session, end_time: new Date().toISOString() }
        })
    }
    if (!found) throw new ApiError("Session not found", 404)
    setSessionsMap(map)
    return { message: "Session ended successfully" }
}

export const demoApi: RealApi = {
    login,
    register,
    logout,
    requestReset,
    resetPassword,
    getCurrentUser,
    updateProfile,
    updatePassword,
    getBoard,
    getBoardByUser,
    updateBoard,
    createBoard,
    searchBoards,
    updateLinks,
    getCardMovements,
    createCardMovement,
    getProgressReport,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getStrategies,
    getStrategy,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    getAllUsers,
    getUserByUsername,
    searchUserByUsername,
    searchUserById,
    getAllLogs,
    getSessionsForCard,
    startSession,
    endSession,
}
