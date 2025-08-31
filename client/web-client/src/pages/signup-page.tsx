import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
    const formSchema = z.object({
        username: z.string().min(1, { message: "Username is required" }),
        email: z.email(),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" }),
    });

    const defaultValues = {
        username: "",
        email: "",
        password: "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const navigate = useNavigate();

    const registerUser = async (user: z.infer<typeof formSchema>) => {
        try {
            const resp = await axiosInstance.post("/users/register", user);
            if (resp.status === 201) {
                navigate("/login");
            } else {
                console.error("Error registering user:", resp.data);
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>
                                Create a new account to get started.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(registerUser)}
                                >
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter username"
                                                    />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter email"
                                                    />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="Enter password"
                                                    />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                        className="w-full bg-sidebar-accent hover:bg-blue-500 transition-colors duration-200"
                                    >
                                        Sign Up
                                    </Button>
                                    <div className="mt-4 text-center text-sm">
                                        Already have an account?{" "}
                                        <Link
                                            to="/login"
                                            className="underline underline-offset-4"
                                        >
                                            Log in
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
