import { useAdminUI } from "@/providers/AdminUIProvider";

export const useSidebar = () => {
    const { sidebar, openSidebar, closeSidebar } = useAdminUI();

    return {
        isOpen: sidebar.isOpen,
        view: sidebar.view,
        data: sidebar.data,
        openSidebar,
        closeSidebar
    };
};
