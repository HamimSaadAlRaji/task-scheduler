import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { axiosInstance } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddTaskDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const formSchema = z.object({
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]),
        dueDate: z.date(),
    });

    const defaultValues = {
        title: "",
        description: "",
        priority: "medium" as const,
        dueDate: new Date(),
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const addTask = async (task: z.infer<typeof formSchema>) => {
        return await axiosInstance.post("/tasks", task);
    };

    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            form.reset(defaultValues);
            setIsDialogOpen(false);
        },
        onError: (error) => {
            console.error("Error adding task:", error);
        },
    });

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-sidebar-accent hover:bg-blue-500 transition-colors duration-200">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your workflow
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) =>
                            mutateAsync(values)
                        )}
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter task title"
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
                            name="description"
                            render={({ field }) => (
                                <FormItem className="mt-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter task description"
                                        />
                                    </FormControl>
                                    <div className="min-h-[20px]">
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left"
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {format(
                                                            field.value,
                                                            "PPP"
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) =>
                                                            date &&
                                                            field.onChange(date)
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <div className="min-h-[20px]">
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <FormControl>
                                            <Select {...field}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">
                                                        Low
                                                    </SelectItem>
                                                    <SelectItem value="medium">
                                                        Medium
                                                    </SelectItem>
                                                    <SelectItem value="high">
                                                        High
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <div className="min-h-[20px]">
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full bg-sidebar-accent hover:bg-blue-500 transition-colors duration-200"
                        >
                            Add Task
                        </Button>
                    </form>
                </Form>
                <div className="space-y-4"></div>
            </DialogContent>
        </Dialog>
    );
}
