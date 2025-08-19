import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
    PlusIcon,
    CalendarIcon,
    BrainIcon,
    Trash2Icon,
    CheckCircleIcon,
} from "lucide-react";
import { format } from "date-fns";

interface Task {
    id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in-progress" | "completed";
    dueDate: Date;
    category: string;
    aiSuggested?: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Complete project proposal",
            description: "Draft and review the Q1 project proposal document",
            priority: "high",
            status: "in-progress",
            dueDate: new Date("2025-01-15"),
            category: "Work",
            aiSuggested: true,
        },
        {
            id: "2",
            title: "Weekly team meeting",
            description: "Discuss project progress and next steps",
            priority: "medium",
            status: "pending",
            dueDate: new Date("2025-01-16"),
            category: "Meetings",
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
            status: "pending",
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

    const updateTaskStatus = (id: string, status: Task["status"]) => {
        setTasks(
            tasks.map((task) => (task.id === id ? { ...task, status } : task))
        );
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const priorityColors = {
        high: "bg-red-500",
        medium: "bg-yellow-500",
        low: "bg-green-500",
    };

    const statusColors = {
        pending: "bg-gray-500",
        "in-progress": "bg-blue-500",
        completed: "bg-green-500",
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Task Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Organize and track your tasks efficiently
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2" />
                            Pending
                        </CardTitle>
                        <CardDescription>
                            Tasks waiting to be started
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tasks
                            .filter((task) => task.status === "pending")
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 border rounded-lg space-y-2"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-medium flex items-center">
                                            {task.title}
                                            {task.aiSuggested && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2 text-xs"
                                                >
                                                    <BrainIcon className="w-3 h-3 mr-1" />
                                                    AI
                                                </Badge>
                                            )}
                                        </h3>
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                priorityColors[task.priority]
                                            }`}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {task.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {task.category}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            {format(task.dueDate, "MMM dd")}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateTaskStatus(
                                                    task.id,
                                                    "in-progress"
                                                )
                                            }
                                            className="flex-1"
                                        >
                                            Start
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </CardContent>
                </Card>

                {/* In Progress Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                            In Progress
                        </CardTitle>
                        <CardDescription>
                            Tasks currently being worked on
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tasks
                            .filter((task) => task.status === "in-progress")
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 border rounded-lg space-y-2 border-blue-200 dark:border-blue-800"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-medium flex items-center">
                                            {task.title}
                                            {task.aiSuggested && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2 text-xs"
                                                >
                                                    <BrainIcon className="w-3 h-3 mr-1" />
                                                    AI
                                                </Badge>
                                            )}
                                        </h3>
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                priorityColors[task.priority]
                                            }`}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {task.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {task.category}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            {format(task.dueDate, "MMM dd")}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateTaskStatus(
                                                    task.id,
                                                    "completed"
                                                )
                                            }
                                            className="flex-1"
                                        >
                                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                                            Complete
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </CardContent>
                </Card>

                {/* Completed Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                            Completed
                        </CardTitle>
                        <CardDescription>
                            Tasks successfully finished
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tasks
                            .filter((task) => task.status === "completed")
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 border rounded-lg space-y-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-medium flex items-center line-through text-gray-600 dark:text-gray-400">
                                            {task.title}
                                            {task.aiSuggested && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2 text-xs"
                                                >
                                                    <BrainIcon className="w-3 h-3 mr-1" />
                                                    AI
                                                </Badge>
                                            )}
                                        </h3>
                                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-through">
                                        {task.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {task.category}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                            {format(task.dueDate, "MMM dd")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
