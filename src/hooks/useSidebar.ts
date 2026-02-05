import { useAdminUI } from "@/providers/AdminUIProvider";

export const useSidebar = () => {
    const { isSettingsOpen, openSettings, closeSettings } = useAdminUI();

    return {
        isSettingsOpen,
        openSettings,
        closeSettings
    };
};
