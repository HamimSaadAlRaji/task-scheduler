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

interface Task {
    id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "in-progress" | "completed";
    dueDate: Date;
}

export default function AddTaskDialog() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Complete project proposal",
            description: "Draft and review the Q1 project proposal document",
            priority: "high",
            status: "in-progress",
            dueDate: new Date("2025-01-15"),
        },
        {
            id: "2",
            title: "Weekly team meeting",
            description: "Discuss project progress and next steps",
            priority: "medium",
            status: "todo",
            dueDate: new Date("2025-01-16"),
        },
    ]);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "medium" as const,
        category: "",
        dueDate: new Date(),
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addTask = () => {
        const task: Task = {
            id: Date.now().toString(),
            ...newTask,
            status: "todo",
        };
        setTasks([...tasks, task]);
        setNewTask({
            title: "",
            description: "",
            priority: "medium",
            category: "",
            dueDate: new Date(),
        });
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-sidebar-accent hover:bg-blue-500 transition-colors duration-200">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your productivity workflow
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={newTask.title}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Enter task title"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={newTask.description}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Enter task description"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={newTask.priority}
                                onValueChange={(value: any) =>
                                    setNewTask({
                                        ...newTask,
                                        priority: value,
                                    })
                                }
                            >
                                <SelectTrigger>
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
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={newTask.category}
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        category: e.target.value,
                                    })
                                }
                                placeholder="Work, Personal, etc."
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(newTask.dueDate, "PPP")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={newTask.dueDate}
                                    onSelect={(date) =>
                                        date &&
                                        setNewTask({
                                            ...newTask,
                                            dueDate: date,
                                        })
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={addTask} className="w-full">
                        Create Task
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
