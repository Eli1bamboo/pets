
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { getWeekRange, formatWeekRange, getNextWeek, getPrevWeek, getTodayStr } from "@/utils/dateUtils";

export function WeekSelector() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const dateParam = searchParams.get("date");
    const { start, end, currentv } = getWeekRange(dateParam);

    const handleNavigate = (dateStr: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("date", dateStr);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                    onClick={() => handleNavigate(getPrevWeek(currentv))}
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                    onClick={() => handleNavigate(getNextWeek(currentv))}
                >
                    <ChevronRight size={20} className="text-gray-600" />
                </Button>
            </div>

            <div className="flex items-center gap-2 px-2 border-l border-r border-gray-100 min-w-[200px] justify-center">
                <Calendar size={18} className="text-brand-500" />
                <span className="text-sm font-semibold text-gray-700 capitalize">
                    {formatWeekRange(start, end)}
                </span>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50"
                onClick={() => handleNavigate(getTodayStr())}
                disabled={formatWeekRange(start, end) === formatWeekRange(...Object.values(getWeekRange()) as [Date, Date])} // Disable if current week
            >
                Esta Semana
            </Button>
        </div>
    );
}
