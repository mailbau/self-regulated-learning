import type { ProgressReport } from "@/types"
import { apiRequest } from "./client"

export async function getProgressReport(): Promise<ProgressReport> {
    return apiRequest<ProgressReport>("/progress-report")
}
