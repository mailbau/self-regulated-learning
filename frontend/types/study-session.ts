export interface StudySession {
    _id: string
    user_id: string
    card_id: string
    start_time: string
    end_time?: string | null
}

export interface StudySessionsResponse {
    sessions: StudySession[]
    total_study_time_minutes: number
}
