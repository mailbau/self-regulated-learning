import type { Board, Card, ColumnMovement, Course, LearningStrategy, List, Log, StudySession, User } from "@/types"
import { COLUMN_TITLES } from "@/lib/constants"

export const DEMO_STUDENT_USER: User = {
    _id: "demo-student-1",
    first_name: "Dewi",
    last_name: "Santika",
    email: "demo.student@example.com",
    username: "demo_student",
    role: "user",
    created_at: daysAgo(30),
}

export const DEMO_ADMIN_USER: User = {
    _id: "demo-admin-1",
    first_name: "Admin",
    last_name: "Gamatutor",
    email: "demo.admin@example.com",
    username: "demo_admin",
    role: "admin",
    created_at: daysAgo(45),
}

export const DEMO_EXTRA_USER: User = {
    _id: "demo-user-3",
    first_name: "Sari",
    last_name: "Lestari",
    email: "sari.lestari@example.com",
    username: "sari_lestari",
    role: "user",
    created_at: daysAgo(20),
}

export const DEMO_USERS: User[] = [DEMO_STUDENT_USER, DEMO_ADMIN_USER, DEMO_EXTRA_USER]

export const DEMO_COURSES: Course[] = [
    { _id: "course-1", course_code: "ALG101", course_name: "Algoritma & Pemrograman", created_at: daysAgo(60) },
    { _id: "course-2", course_code: "BASDAT201", course_name: "Basis Data", created_at: daysAgo(58) },
    { _id: "course-3", course_code: "JARKOM301", course_name: "Jaringan Komputer", created_at: daysAgo(55) },
    { _id: "course-4", course_code: "KALK101", course_name: "Kalkulus", created_at: daysAgo(50) },
    { _id: "course-5", course_code: "PBO202", course_name: "Pemrograman Berorientasi Objek", created_at: daysAgo(48) },
    { _id: "course-6", course_code: "SISOP301", course_name: "Sistem Operasi", created_at: daysAgo(45) },
]

export const DEMO_STRATEGIES: LearningStrategy[] = [
    { id: "strategy-1", name: "Rehearsal Strategies - Pengulangan Materi", description: "Membaca dan mengulang catatan secara berkala.", created_at: daysAgo(60) },
    { id: "strategy-2", name: "Elaboration Strategies - Menghubungkan Materi", description: "Menghubungkan materi baru dengan pengetahuan yang sudah ada.", created_at: daysAgo(59) },
    { id: "strategy-3", name: "Organizational Strategies - Membuat Mind Mapping", description: "Menyusun materi ke dalam peta konsep atau diagram.", created_at: daysAgo(58) },
    { id: "strategy-4", name: "Metacognitive Self-Regulation", description: "Merencanakan, memantau, dan mengevaluasi proses belajar sendiri.", created_at: daysAgo(57) },
    { id: "strategy-5", name: "Time Management - Teknik Pomodoro", description: "Belajar dalam interval fokus 25 menit dengan istirahat singkat.", created_at: daysAgo(56) },
    { id: "strategy-6", name: "Help-Seeking Strategies - Diskusi Kelompok", description: "Bertanya ke dosen/teman atau belajar kelompok saat kesulitan.", created_at: daysAgo(55) },
    { id: "strategy-7", name: "Spaced Repetition", description: "Mengulang materi dengan jarak waktu yang semakin panjang.", created_at: daysAgo(54) },
    { id: "strategy-8", name: "Active Recall", description: "Menguji diri sendiri tanpa melihat catatan.", created_at: daysAgo(53) },
]

export const DEMO_LOGS: Log[] = [
    { id: "log-1", username: DEMO_STUDENT_USER.username, action_type: "login", description: `${DEMO_STUDENT_USER.username} logged in to the application`, created_at: hoursAgo(1) },
    { id: "log-2", username: DEMO_ADMIN_USER.username, action_type: "login", description: `${DEMO_ADMIN_USER.username} logged in to the application`, created_at: hoursAgo(2) },
    { id: "log-3", username: DEMO_EXTRA_USER.username, action_type: "login", description: `${DEMO_EXTRA_USER.username} logged in to the application`, created_at: hoursAgo(5) },
    { id: "log-4", username: DEMO_EXTRA_USER.username, action_type: "logout", description: `${DEMO_EXTRA_USER.username} logged out of the application`, created_at: hoursAgo(4) },
    { id: "log-5", username: DEMO_STUDENT_USER.username, action_type: "logout", description: `${DEMO_STUDENT_USER.username} logged out of the application`, created_at: daysAgo(1) },
    { id: "log-6", username: DEMO_STUDENT_USER.username, action_type: "login", description: `${DEMO_STUDENT_USER.username} logged in to the application`, created_at: daysAgo(1) },
    { id: "log-7", username: DEMO_ADMIN_USER.username, action_type: "logout", description: `${DEMO_ADMIN_USER.username} logged out of the application`, created_at: daysAgo(2) },
]

function daysAgo(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString()
}

function hoursAgo(hours: number): string {
    const date = new Date()
    date.setHours(date.getHours() - hours)
    return date.toISOString()
}

function movement(fromColumn: string, toColumn: string, atDaysAgo: number): ColumnMovement {
    return { fromColumn, toColumn, timestamp: daysAgo(atDaysAgo) }
}

let cardSequence = 0
function nextCardId(courseCode: string): string {
    cardSequence += 1
    return `demo-card-${courseCode.toLowerCase()}-${cardSequence}`
}

interface DemoCardOptions {
    courseCode: string
    courseName: string
    material: string
    difficulty: Card["difficulty"]
    priority: Card["priority"]
    strategy: string
    createdDaysAgo: number
    columnMovements: ColumnMovement[]
    preTestGrade?: string
    postTestGrade?: string
    notes?: string
    rating?: number
    checklistDone?: number
    checklistTotal?: number
    links?: string[]
}

function buildCard(options: DemoCardOptions): Card {
    const {
        courseCode,
        courseName,
        material,
        difficulty,
        priority,
        strategy,
        createdDaysAgo,
        columnMovements,
        preTestGrade,
        postTestGrade,
        notes,
        rating,
        checklistDone,
        checklistTotal,
        links,
    } = options

    const card: Card = {
        id: nextCardId(courseCode),
        title: `${courseName} [${courseCode}]`,
        sub_title: material,
        description: "",
        difficulty,
        priority,
        learning_strategy: strategy,
        created_at: daysAgo(createdDaysAgo),
        column_movements: columnMovements,
    }

    if (preTestGrade !== undefined) card.pre_test_grade = preTestGrade
    if (postTestGrade !== undefined) card.post_test_grade = postTestGrade
    if (notes !== undefined) card.notes = notes
    if (rating !== undefined) card.rating = rating

    if (checklistTotal) {
        card.checklists = [
            {
                id: `${card.id}-checklist-1`,
                title: "Langkah Belajar",
                items: Array.from({ length: checklistTotal }, (_, i) => ({
                    id: `${card.id}-item-${i + 1}`,
                    text: [`Baca materi ${material}`, "Kerjakan latihan soal", "Diskusikan dengan teman", "Review ulang catatan"][i] ?? `Langkah ${i + 1}`,
                    completed: i < (checklistDone ?? 0),
                })),
            },
        ]
    }

    if (links?.length) {
        card.links = links.map((url, i) => ({ id: `${card.id}-link-${i + 1}`, url }))
    }

    return card
}

function buildList(id: string, title: string, cards: Card[]): List {
    return { id, title, cards, isAddingCard: false }
}

const S = DEMO_STRATEGIES.map((s) => s.name)

/** The primary demo student board: 12 cards spread across all 4 columns with varied, realistic progress. */
export function buildStudentBoard(): Board {
    const planning = [
        buildCard({
            courseCode: "ALG101", courseName: "Algoritma & Pemrograman", material: "Sorting Algorithms",
            difficulty: "medium", priority: "high", strategy: S[0], createdDaysAgo: 6,
            columnMovements: [movement("initial", "list1", 6)],
            checklistTotal: 3, checklistDone: 1,
        }),
        buildCard({
            courseCode: "BASDAT201", courseName: "Basis Data", material: "Normalisasi Database",
            difficulty: "hard", priority: "medium", strategy: S[2], createdDaysAgo: 5,
            columnMovements: [movement("initial", "list1", 5)],
        }),
        buildCard({
            courseCode: "KALK101", courseName: "Kalkulus", material: "Integral Tak Tentu",
            difficulty: "easy", priority: "low", strategy: S[6], createdDaysAgo: 4,
            columnMovements: [movement("initial", "list1", 4)],
        }),
        buildCard({
            courseCode: "SISOP301", courseName: "Sistem Operasi", material: "Manajemen Proses",
            difficulty: "medium", priority: "critical", strategy: S[4], createdDaysAgo: 3,
            columnMovements: [movement("initial", "list1", 3)],
            links: ["https://en.wikipedia.org/wiki/Process_management_(computing)"],
        }),
    ]

    const monitoring = [
        buildCard({
            courseCode: "PBO202", courseName: "Pemrograman Berorientasi Objek", material: "Inheritance & Polymorphism",
            difficulty: "hard", priority: "high", strategy: S[1], createdDaysAgo: 9,
            columnMovements: [movement("initial", "list1", 9), movement("list1", "list2", 7)],
            preTestGrade: "65", checklistTotal: 3, checklistDone: 2,
        }),
        buildCard({
            courseCode: "JARKOM301", courseName: "Jaringan Komputer", material: "OSI Layer Model",
            difficulty: "medium", priority: "medium", strategy: S[3], createdDaysAgo: 8,
            columnMovements: [movement("initial", "list1", 8), movement("list1", "list2", 6)],
            preTestGrade: "70",
        }),
        buildCard({
            courseCode: "ALG101", courseName: "Algoritma & Pemrograman", material: "Dynamic Programming",
            difficulty: "expert", priority: "critical", strategy: S[7], createdDaysAgo: 7,
            columnMovements: [movement("initial", "list1", 7), movement("list1", "list2", 5)],
            preTestGrade: "55",
        }),
    ]

    const controlling = [
        buildCard({
            courseCode: "BASDAT201", courseName: "Basis Data", material: "SQL Query Optimization",
            difficulty: "medium", priority: "medium", strategy: S[5], createdDaysAgo: 12,
            columnMovements: [movement("initial", "list1", 12), movement("list1", "list2", 9), movement("list2", "list3", 5)],
            preTestGrade: "60", postTestGrade: "80", notes: "Butuh latihan lebih banyak untuk query kompleks.",
            checklistTotal: 4, checklistDone: 4,
        }),
        buildCard({
            courseCode: "KALK101", courseName: "Kalkulus", material: "Turunan Fungsi Trigonometri",
            difficulty: "easy", priority: "low", strategy: S[0], createdDaysAgo: 11,
            columnMovements: [movement("initial", "list1", 11), movement("list1", "list2", 8), movement("list2", "list3", 4)],
            preTestGrade: "75", postTestGrade: "88", notes: "Sudah paham konsep dasar.",
        }),
        buildCard({
            courseCode: "SISOP301", courseName: "Sistem Operasi", material: "Deadlock & Sinkronisasi",
            difficulty: "hard", priority: "high", strategy: S[2], createdDaysAgo: 10,
            columnMovements: [movement("initial", "list1", 10), movement("list1", "list2", 7), movement("list2", "list3", 3)],
            preTestGrade: "50", postTestGrade: "72", notes: "",
        }),
    ]

    const reflection = [
        buildCard({
            courseCode: "PBO202", courseName: "Pemrograman Berorientasi Objek", material: "Design Patterns Dasar",
            difficulty: "medium", priority: "medium", strategy: S[1], createdDaysAgo: 16,
            columnMovements: [
                movement("initial", "list1", 16), movement("list1", "list2", 13),
                movement("list2", "list3", 9), movement("list3", "list4", 2),
            ],
            preTestGrade: "68", postTestGrade: "90", notes: "Design pattern sangat membantu struktur kode.",
            rating: 5, checklistTotal: 3, checklistDone: 3,
        }),
        buildCard({
            courseCode: "JARKOM301", courseName: "Jaringan Komputer", material: "Subnetting & IP Addressing",
            difficulty: "hard", priority: "high", strategy: S[4], createdDaysAgo: 15,
            columnMovements: [
                movement("initial", "list1", 15), movement("list1", "list2", 12),
                movement("list2", "list3", 8), movement("list3", "list4", 1),
            ],
            preTestGrade: "58", postTestGrade: "85", notes: "Latihan subnetting berulang kali sangat efektif.",
            rating: 4,
        }),
    ]

    return {
        id: "demo-board-student-1",
        name: `${DEMO_STUDENT_USER.first_name}'s Learning Board`,
        lists: [
            buildList("list1", COLUMN_TITLES.PLANNING, planning),
            buildList("list2", COLUMN_TITLES.MONITORING, monitoring),
            buildList("list3", COLUMN_TITLES.CONTROLLING, controlling),
            buildList("list4", COLUMN_TITLES.REFLECTION, reflection),
        ],
    }
}

/** Lighter boards for the other two demo users, mainly so the admin "view user's board" flow has data. */
export function buildSecondaryBoard(owner: User): Board {
    const isExtra = owner._id === DEMO_EXTRA_USER._id
    const planning = [
        buildCard({
            courseCode: "ALG101", courseName: "Algoritma & Pemrograman", material: "Struktur Data Dasar",
            difficulty: "easy", priority: "medium", strategy: S[0], createdDaysAgo: 4,
            columnMovements: [movement("initial", "list1", 4)],
        }),
    ]
    const monitoring = [
        buildCard({
            courseCode: "KALK101", courseName: "Kalkulus", material: "Limit Fungsi",
            difficulty: "medium", priority: "low", strategy: S[6], createdDaysAgo: 6,
            columnMovements: [movement("initial", "list1", 6), movement("list1", "list2", 3)],
            preTestGrade: isExtra ? "62" : undefined,
        }),
    ]
    const controlling = [
        buildCard({
            courseCode: "BASDAT201", courseName: "Basis Data", material: "Entity Relationship Diagram",
            difficulty: "medium", priority: "medium", strategy: S[2], createdDaysAgo: 9,
            columnMovements: [movement("initial", "list1", 9), movement("list1", "list2", 6), movement("list2", "list3", 2)],
            preTestGrade: "64", postTestGrade: "78", notes: "Cukup jelas setelah diskusi kelompok.",
        }),
    ]
    const reflection = isExtra
        ? [
            buildCard({
                courseCode: "JARKOM301", courseName: "Jaringan Komputer", material: "Protokol TCP/IP",
                difficulty: "hard", priority: "high", strategy: S[5], createdDaysAgo: 13,
                columnMovements: [
                    movement("initial", "list1", 13), movement("list1", "list2", 10),
                    movement("list2", "list3", 6), movement("list3", "list4", 2),
                ],
                preTestGrade: "55", postTestGrade: "82", notes: "Belajar bersama kelompok sangat membantu.",
                rating: 4,
            }),
        ]
        : []

    return {
        id: `demo-board-${owner._id}`,
        name: `${owner.first_name}'s Learning Board`,
        lists: [
            buildList("list1", COLUMN_TITLES.PLANNING, planning),
            buildList("list2", COLUMN_TITLES.MONITORING, monitoring),
            buildList("list3", COLUMN_TITLES.CONTROLLING, controlling),
            buildList("list4", COLUMN_TITLES.REFLECTION, reflection),
        ],
    }
}

/** Completed study sessions for a couple of the student board's cards, so accumulated time shows up. */
export function buildStudySessions(studentBoard: Board): Record<string, StudySession[]> {
    const findCard = (material: string) =>
        studentBoard.lists.flatMap((list) => list.cards).find((card) => card.sub_title === material)

    const sessions: Record<string, StudySession[]> = {}

    const inheritance = findCard("Inheritance & Polymorphism")
    if (inheritance) {
        sessions[inheritance.id] = [
            { _id: "session-1", user_id: DEMO_STUDENT_USER._id, card_id: inheritance.id, start_time: daysAgo(7), end_time: hoursAgo(163) },
            { _id: "session-2", user_id: DEMO_STUDENT_USER._id, card_id: inheritance.id, start_time: hoursAgo(50), end_time: hoursAgo(49) },
        ]
    }

    const designPatterns = findCard("Design Patterns Dasar")
    if (designPatterns) {
        sessions[designPatterns.id] = [
            { _id: "session-3", user_id: DEMO_STUDENT_USER._id, card_id: designPatterns.id, start_time: daysAgo(3), end_time: hoursAgo(66) },
        ]
    }

    return sessions
}
