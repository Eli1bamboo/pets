import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getWeekRange, formatWeekRange, getNextWeek, getPrevWeek } from '../../utils/dateUtils';
import { format } from 'date-fns';

describe('dateUtils', () => {
    beforeEach(() => {
        // Mock system time to fixed date: 2024-02-14 (Wednesday) local time
        vi.useFakeTimers();
        const date = new Date(2024, 1, 14, 12, 0, 0); // Feb 14 2024 12:00 Local
        vi.setSystemTime(date);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('getWeekRange', () => {
        it('returns current week range when no date provided', () => {
            const range = getWeekRange();
            // Week starts Monday Feb 12
            expect(format(range.start, 'yyyy-MM-dd')).toBe('2024-02-12');
            expect(format(range.end, 'yyyy-MM-dd')).toBe('2024-02-18');
        });

        it('returns correct week range for specific date', () => {
            // Input: 2024-03-01 (Friday). Constructed as local date string
            const range = getWeekRange('2024-03-01');
            // Week starts Monday Feb 26
            expect(format(range.start, 'yyyy-MM-dd')).toBe('2024-02-26');
            expect(format(range.end, 'yyyy-MM-dd')).toBe('2024-03-03');
        });
    });

    describe('formatWeekRange', () => {
        it('formats range in Spanish', () => {
            // Create local dates
            const start = new Date(2024, 1, 12); // Feb 12
            const end = new Date(2024, 1, 18);   // Feb 18

            const result = formatWeekRange(start, end);
            // Uses non-breaking space or standard space? regex handles both roughly
            expect(result).toMatch(/12 de febrero - 18 de febrero/);
        });
    });

    describe('Navigation', () => {
        it('getNextWeek returns valid date string +1 week', () => {
            const date = new Date(2024, 1, 14); // Feb 14
            const result = getNextWeek(date);
            expect(result).toBe('2024-02-21');
        });

        it('getPrevWeek returns valid date string -1 week', () => {
            const date = new Date(2024, 1, 14); // Feb 14
            const result = getPrevWeek(date);
            expect(result).toBe('2024-02-07');
        });
    });
});

