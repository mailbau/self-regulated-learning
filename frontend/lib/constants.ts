export const COLUMN_TITLES = {
    PLANNING: "Planning (To Do)",
    MONITORING: "Monitoring (In Progress)",
    CONTROLLING: "Controlling (Review)",
    REFLECTION: "Reflection (Done)",
} as const

export const PRIORITY_LEVELS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const

export const DIFFICULTY_LEVELS = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
    { value: "expert", label: "Expert" },
] as const

export const DEFAULT_LEARNING_STRATEGY = "Rehearsal Strategies - Pengulangan Materi"

export const ADMIN_SECTIONS = {
    COURSES: "courses",
    LEARNING_STRATEGIES: "learningStrategies",
    USERS: "users",
    LOGS: "logs",
} as const
