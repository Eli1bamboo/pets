"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SheetContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

interface SheetProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Sheet({ children, open = false, onOpenChange }: SheetProps) {
    const [isOpen, setIsOpen] = React.useState(open);

    React.useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleOpenChange = (newOpen: boolean) => {
        setIsOpen(newOpen);
        onOpenChange?.(newOpen);
    };

    return (
        <SheetContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
            {children}
        </SheetContext.Provider>
    );
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: "right" | "left";
}

export function SheetContent({
    children,
    className,
    side = "right",
    ...props
}: SheetContentProps) {
    const context = React.useContext(SheetContext);
    if (!context) throw new Error("SheetContent must be used within a Sheet");

    const { open, setOpen } = context;

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 transition-opacity animate-in fade-in-0"
                onClick={() => setOpen(false)}
            />
            {/* Sidebar */}
            <div
                className={cn(
                    "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out animate-in duration-300 sm:max-w-sm h-full top-0 right-0 w-3/4 border-l",
                    side === "right" ? "slide-in-from-right" : "slide-in-from-left",
                    className
                )}
                {...props}
            >
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100"
                    onClick={() => setOpen(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </>
    );
}

export function SheetHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col space-y-2 text-center sm:text-left",
                className
            )}
            {...props}
        />
    );
}

export function SheetTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                "text-lg font-semibold text-slate-950",
                className
            )}
            {...props}
        />
    );
}

export function SheetDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-sm text-slate-500", className)}
            {...props}
        />
    );
}
