import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Trash2Icon, CheckCircleIcon, EditIcon } from "lucide-react";
import { format } from "date-fns";
import AddTaskDialog from "@/components/tasks/add-task-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "in-progress" | "completed";
    dueDate: Date;
}

export default function TasksPage() {
    const fetchTasks = async (): Promise<Task[]> => {
        const resp = await axiosInstance.get("/tasks");
        return resp.data;
    };

    const { data: tasks } = useQuery({
        queryFn: fetchTasks,
        queryKey: ["tasks"],
    });

    const priorityColors = {
        high: "text-red-500 bg-red-100",
        medium: "text-yellow-500 bg-yellow-100",
        low: "text-green-600 bg-green-100",
    };

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <AddTaskDialog />
            </div>

            <Tabs defaultValue="todo">
                <TabsList className="w-[200px] bg-blue-50 border border-blue-100 mb-6">
                    <TabsTrigger value="todo">To Do</TabsTrigger>
                    <TabsTrigger value="completed">Done</TabsTrigger>
                </TabsList>
                <TabsContent value="todo">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                        {tasks
                            ?.filter((task) => task.status === "todo")
                            .map((task) => (
                                <Card key={task._id} className="mb-4">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div className="flex items-center">
                                            <CardTitle className="text-base font-medium">
                                                {task.title}
                                            </CardTitle>
                                        </div>
                                        <Badge
                                            variant={"outline"}
                                            className={
                                                priorityColors[task.priority]
                                            }
                                        >
                                            {task.priority}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                            {task.description}
                                        </CardDescription>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {format(
                                                    task.dueDate,
                                                    "MMM dd, yyyy"
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 mt-4">
                                            <Button
                                                size="sm"
                                                // onClick={() =>
                                                //     updateTaskStatus(
                                                //         task._id,
                                                //         "completed"
                                                //     )
                                                // }
                                                className="flex-1 text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200"
                                            >
                                                Mark As Done
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <EditIcon className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                // onClick={() =>
                                                //     deleteTask(task._id)
                                                // }
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </TabsContent>
                <TabsContent value="completed">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                        {tasks
                            ?.filter((task) => task.status === "completed")
                            .map((task) => (
                                <Card
                                    key={task._id}
                                    className="mb-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                                >
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div className="flex items-center">
                                            <CardTitle className="text-base font-medium line-through text-gray-600 dark:text-gray-400 flex items-center">
                                                {task.title}
                                                <CheckCircleIcon className="w-4 h-4 ml-2 text-green-500" />
                                            </CardTitle>
                                        </div>
                                        <Badge
                                            variant={"outline"}
                                            className={
                                                priorityColors[task.priority]
                                            }
                                        >
                                            {task.priority}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-through">
                                            {task.description}
                                        </CardDescription>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {format(
                                                    task.dueDate,
                                                    "MMM dd, yyyy"
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 mt-4">
                                            <Button
                                                size="sm"
                                                // onClick={() =>
                                                //     updateTaskStatus(
                                                //         task._id,
                                                //         "todo"
                                                //     )
                                                // }
                                                className="flex-1 text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200"
                                            >
                                                Mark As To Do
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <EditIcon className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                // onClick={() =>
                                                //     deleteTask(task._id)
                                                // }
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
