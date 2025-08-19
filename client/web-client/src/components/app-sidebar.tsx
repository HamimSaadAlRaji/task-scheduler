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
} from "./ui/sidebar";
import {
    BrainCircuitIcon,
    CalendarIcon,
    ChevronsUpDownIcon,
    SquareCheckBigIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function AppSidebar() {
    const { open } = useSidebar();
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

    const user = {
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://example.com/avatar.jpg",
    };

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

            <SidebarContent className="mt-4 ml-2">
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
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg bg-gray-200">
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
