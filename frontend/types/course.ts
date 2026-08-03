export interface Course {
    _id: string
    course_code: string
    course_name: string
    created_at?: string
}

/** Domain shape used throughout the app; the wire format (`_id`/`learning_strat_name`) is normalized to this in lib/api/admin.ts. */
export interface LearningStrategy {
    id: string
    name: string
    description?: string | null
}

export interface LearningStrategyInput {
    name: string
    description?: string | null
}
