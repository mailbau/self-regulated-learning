import * as auth from "./auth"
import * as board from "./board"
import * as cards from "./cards"
import * as analytics from "./analytics"
import * as admin from "./admin"
import * as studySessions from "./study-sessions"
import { demoApi } from "@/lib/demo/mockApi"

const realApi = { ...auth, ...board, ...cards, ...analytics, ...admin, ...studySessions }

export type RealApi = typeof realApi

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export const api: RealApi = isDemoMode ? demoApi : realApi
