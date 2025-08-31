import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "./auth-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
export default function UserMenu() {
    const { user, setIsAuth, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        setIsAuth(false);
        setUser(null);
        localStorage.setItem("isAuth", JSON.stringify(false));
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="hover:bg-gray-200 hover:text-accent-foreground transition-colors duration-200">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-lg bg-gray-200">
                                {user.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {user.split("@")[0]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {user}
                            </span>
                        </div>
                        <ChevronsUpDownIcon className="ml-auto size-4" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52">
                    <DropdownMenuItem>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="w-full justify-start text-red-500"
                            onClick={handleLogout}
                        >
                            <LogOutIcon className="w-4 h-4 mr-2 text-red-500 " />
                            <span>Logout</span>
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
