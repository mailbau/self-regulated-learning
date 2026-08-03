export interface Log {
    id: string
    username: string
    action_type: "login" | "logout"
    description: string
    created_at: string
}
