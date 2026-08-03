import type { Course, LearningStrategy, LearningStrategyInput, Log, User } from "@/types"
import { apiRequest } from "./client"
import type { MessageResponse } from "./auth"

// --- Courses ---

export async function getCourses(): Promise<Course[]> {
    return apiRequest<Course[]>("/courses")
}

export async function createCourse(course: { course_code: string; course_name: string }): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
    })
}

export async function updateCourse(
    courseCode: string,
    course: { course_code: string; course_name: string }
): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/courses/${courseCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
    })
}

export async function deleteCourse(courseCode: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/courses/${courseCode}`, { method: "DELETE" })
}

// --- Learning Strategies ---
// The backend stores/returns strategies as { _id, learning_strat_name, description }; every
// consumer works with the normalized { id, name, description } domain shape instead.

interface RawLearningStrategy {
    _id: string
    learning_strat_name: string
    description?: string | null
}

function normalizeStrategy(raw: RawLearningStrategy): LearningStrategy {
    return { id: raw._id, name: raw.learning_strat_name, description: raw.description }
}

export async function getStrategies(): Promise<LearningStrategy[]> {
    const raw = await apiRequest<RawLearningStrategy[]>("/learningstrats")
    return raw.map(normalizeStrategy)
}

export async function getStrategy(id: string): Promise<LearningStrategy> {
    const raw = await apiRequest<RawLearningStrategy>(`/learningstrats/${id}`)
    return normalizeStrategy(raw)
}

export async function createStrategy(strategy: LearningStrategyInput): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/learningstrats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            learning_strat_name: strategy.name,
            description: strategy.description,
        }),
    })
}

export async function updateStrategy(id: string, strategy: LearningStrategyInput): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/learningstrats/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            learning_strat_name: strategy.name,
            description: strategy.description,
        }),
    })
}

export async function deleteStrategy(id: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/learningstrats/${id}`, { method: "DELETE" })
}

// --- Users ---

export async function getAllUsers(): Promise<User[]> {
    return apiRequest<User[]>("/users")
}

export async function getUserByUsername(username: string): Promise<User> {
    return apiRequest<User>(`/users/username/${encodeURIComponent(username)}`)
}

export async function searchUserByUsername(username: string): Promise<User> {
    return apiRequest<User>(`/username/${username}`)
}

export async function searchUserById(userId: string): Promise<User> {
    return apiRequest<User>(`/users/id/${userId}`)
}

// --- Logs ---

export async function getAllLogs(): Promise<Log[]> {
    return apiRequest<Log[]>("/api/logs")
}
