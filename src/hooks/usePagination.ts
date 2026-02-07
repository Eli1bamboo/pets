
import { useState } from "react";

interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage: number;
    initialPage?: number;
}

export function usePagination<T>({ items, itemsPerPage, initialPage = 1 }: UsePaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    return {
        currentPage,
        totalPages,
        currentItems,
        startIndex,
        endIndex,
        goToPage,
        nextPage,
        prevPage
    };
}
