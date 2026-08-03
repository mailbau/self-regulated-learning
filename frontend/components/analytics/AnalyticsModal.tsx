"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalytics } from "@/hooks/useAnalytics"
import ProgressSummary from "./ProgressSummary"
import TaskDistributionChart from "./TaskDistributionChart"

interface AnalyticsModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
    const { report, loading } = useAnalytics(isOpen)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Learning Progress Dashboard</DialogTitle>
                    <DialogDescription>
                        Track your learning progress and performance across different strategies and courses
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-[150px] w-full" />
                        <Skeleton className="h-[150px] w-full" />
                    </div>
                ) : report ? (
                    <div className="space-y-4">
                        <ProgressSummary progress={report} />
                        <TaskDistributionChart
                            listReport={report.list_report}
                            topStrategies={report.top_strategies}
                            courseStats={report.course_stats}
                        />
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
