import type { Board, Course, LearningStrategy, Log, StudySession, User } from "@/types"
import {
    DEMO_ADMIN_USER,
    DEMO_COURSES,
    DEMO_EXTRA_USER,
    DEMO_LOGS,
    DEMO_STRATEGIES,
    DEMO_STUDENT_USER,
    DEMO_USERS,
    buildSecondaryBoard,
    buildStudentBoard,
    buildStudySessions,
} from "./seeds"

const PREFIX = "klb_demo_"

export const DEMO_KEYS = {
    INITIALIZED: `${PREFIX}initialized`,
    CURRENT_USER: `${PREFIX}current_user`,
    TOKEN: `${PREFIX}token`,
    USERS: `${PREFIX}users`,
    BOARDS: `${PREFIX}boards`,
    COURSES: `${PREFIX}courses`,
    STRATEGIES: `${PREFIX}strategies`,
    LOGS: `${PREFIX}logs`,
    STUDY_SESSIONS: `${PREFIX}study_sessions`,
} as const

export function getDemoItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback
    ensureDemoDataSeeded()
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    try {
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}

export function setDemoItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(value))
}

/** Seeds every klb_demo_* key on first touch. Safe to call repeatedly. */
export function ensureDemoDataSeeded(): void {
    if (typeof window === "undefined") return
    if (localStorage.getItem(DEMO_KEYS.INITIALIZED) === "true") return
    seedAll()
    localStorage.setItem(DEMO_KEYS.INITIALIZED, "true")
}

export function resetDemoData(): void {
    if (typeof window === "undefined") return
    Object.keys(localStorage)
        .filter((key) => key.startsWith(PREFIX))
        .forEach((key) => localStorage.removeItem(key))
    seedAll()
    localStorage.setItem(DEMO_KEYS.INITIALIZED, "true")
}

function seedAll(): void {
    const users: User[] = DEMO_USERS
    setDemoItem<User[]>(DEMO_KEYS.USERS, users)
    setDemoItem<Course[]>(DEMO_KEYS.COURSES, DEMO_COURSES)
    setDemoItem<LearningStrategy[]>(DEMO_KEYS.STRATEGIES, DEMO_STRATEGIES)
    setDemoItem<Log[]>(DEMO_KEYS.LOGS, DEMO_LOGS)

    const studentBoard = buildStudentBoard()
    const boards: Record<string, Board> = {
        [DEMO_STUDENT_USER._id]: studentBoard,
        [DEMO_ADMIN_USER._id]: buildSecondaryBoard(DEMO_ADMIN_USER),
        [DEMO_EXTRA_USER._id]: buildSecondaryBoard(DEMO_EXTRA_USER),
    }
    setDemoItem<Record<string, Board>>(DEMO_KEYS.BOARDS, boards)
    setDemoItem<Record<string, StudySession[]>>(DEMO_KEYS.STUDY_SESSIONS, buildStudySessions(studentBoard))
}
