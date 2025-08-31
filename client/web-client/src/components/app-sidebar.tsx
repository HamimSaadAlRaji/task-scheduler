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
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    BrainCircuitIcon,
    CalendarIcon,
    HomeIcon,
    SquareCheckBigIcon,
} from "lucide-react";
import UserMenu from "@/components/user-menu";

export function AppSidebar() {
    const { open } = useSidebar();
    const items = [
        {
            title: "Home",
            url: "/",
            icon: HomeIcon,
        },
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
                {open ? (
                    <div className="flex items-center justify-between my-2">
                        <div className="flex items-center gap-2">
                            <span>
                                <BrainCircuitIcon className="h-6 w-6 text-blue-500" />
                            </span>
                            <h1 className="text-xl font-semibold text-blue-500">
                                Task Scheduler
                            </h1>
                        </div>
                        <SidebarTrigger />
                    </div>
                ) : (
                    <SidebarTrigger />
                )}
            </SidebarHeader>

            <SidebarContent className="mt-4 mx-2">
                <SidebarMenu>
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
                <SidebarMenu className="mb-2">
                    <UserMenu />
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
