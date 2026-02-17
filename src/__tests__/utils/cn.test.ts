import { describe, it, expect } from "vitest";
import { cn } from "@/utils/cn";

describe("cn utility", () => {
    it("merges class names correctly", () => {
        expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    });

    it("handles conditional classes", () => {
        const isActive = true;
        const isDisabled = false;
        expect(cn("base-class", isActive && "active", isDisabled && "disabled")).toBe(
            "base-class active"
        );
    });

    it("merges tailwind conflicts correctly", () => {
        expect(cn("p-4", "p-2")).toBe("p-2");
        expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("handles complex combinations", () => {
        expect(cn("text-lg", ["font-bold", { "text-center": true }])).toBe(
            "text-lg font-bold text-center"
        );
    });
});
