import { Navigate, Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useContext } from "react";
import { AuthContext } from "@/components/auth-context";

export default function Dashboard() {
    const { isAuth } = useContext(AuthContext);

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
