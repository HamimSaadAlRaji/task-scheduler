import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

    const defaultTask = {
        title: "",
        description: "",
        priority: "medium" as const,
        dueDate: new Date(),
    };
    const [task, setTask] = useState(defaultTask);

    const addTask = async () => {
        return await axiosInstance.post("/tasks", task);
    };

    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            setIsDialogOpen(false);
            setTask(defaultTask);
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
                <div className="space-y-4">
                    <div>
                        <Label className="mb-2" htmlFor="title">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={task.title}
                            onChange={(e) =>
                                setTask({
                                    ...task,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Enter task title"
                        />
                    </div>
                    <div>
                        <Label className="mb-2" htmlFor="description">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={task.description}
                            onChange={(e) =>
                                setTask({
                                    ...task,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Enter task description"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2">Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(task.dueDate, "PPP")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={task.dueDate}
                                        onSelect={(date) =>
                                            date &&
                                            setTask({
                                                ...task,
                                                dueDate: date,
                                            })
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label className="mb-2" htmlFor="priority">
                                Priority
                            </Label>
                            <Select
                                value={task.priority}
                                onValueChange={(value: any) =>
                                    setTask({
                                        ...task,
                                        priority: value,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            mutateAsync();
                        }}
                        className="w-full bg-sidebar-accent hover:bg-blue-500 transition-colors duration-200"
                    >
                        Add Task
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
