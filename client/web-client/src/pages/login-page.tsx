import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/utils";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router";

export default function LoginPage() {
    const { isAuth, setIsAuth, setUser } = useContext(AuthContext);
    if (isAuth) {
        return <Navigate to="/" />;
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    function login() {
        setIsAuth(true);
        localStorage.setItem("isAuth", "true");
        setUser(email);
        localStorage.setItem("user", JSON.stringify(email));
        navigate("/");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const resp = await axiosInstance.post("/users/login", {
                email,
                password,
            });
            if (resp.status === 201) {
                login();
            } else {
                console.log("Login failed:", resp.data);
                setIsError(true);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setIsError(true);
            return;
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="user@example.com"
                                            required
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            {/* <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a> */}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </div>
                                    {isError && (
                                        <div className="text-red-500">
                                            Invalid email or password
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-500 transition-colors duration-200"
                                        >
                                            Login
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <a
                                        href="#"
                                        className="underline underline-offset-4"
                                    >
                                        Sign up
                                    </a>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
