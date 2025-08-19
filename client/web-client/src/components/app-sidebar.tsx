import { Link, useLocation } from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "./ui/sidebar";
import {
    BrainCircuitIcon,
    CalendarIcon,
    SquareCheckBigIcon,
} from "lucide-react";

export function AppSidebar() {
    const items = [
        {
            title: "Tasks",
            url: "/tasks",
            icon: SquareCheckBigIcon,
            isActive: true,
        },
        {
            title: "Calendar",
            url: "/calendar",
            icon: CalendarIcon,
        },
    ];
    const location = useLocation();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border border-b-1">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <span>
                                <BrainCircuitIcon className="h-6 w-6 text-blue-500" />
                            </span>
                            <h1 className="text-xl font-semibold text-blue-500">
                                Task Scheduler
                            </h1>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="mt-4">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                isActive={item.url === location.pathname}
                                asChild
                            >
                                <Link to={item.url}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <p>© 2023 Task Scheduler</p>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
