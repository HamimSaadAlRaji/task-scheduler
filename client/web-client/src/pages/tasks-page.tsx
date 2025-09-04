import { CheckCircleIcon, ClipboardListIcon, ClockIcon } from "lucide-react"; import AddTaskDialog from "@/components/tasks/add-task-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "@/lib/types";
import TaskCard from "@/components/tasks/task-card";

export default function TasksPage() {
    const fetchTasks = async (): Promise<Task[]> => {
        const resp = await axiosInstance.get("/tasks");
        return resp.data;
    };

    const { data: tasks } = useQuery({
        queryFn: fetchTasks,
        queryKey: ["tasks"],
    });

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <AddTaskDialog />
            </div>

            <Tabs defaultValue="todo">
                <TabsList className="w-[200px] bg-blue-50 border border-blue-100 mb-6">
                    <TabsTrigger value="todo">
                        <ClipboardListIcon className="w-4 h-4 text-blue-500" />
                        <span>To Do</span>
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        <ClockIcon className="w-4 h-4 text-orange-500" />
                        <span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>Done</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="todo">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                        {tasks
                            ?.filter((task) => task.status === "todo")
                            .map((task) => (
                                <TaskCard key={task._id} task={task} />
                            ))}
                    </div>
                </TabsContent>
                <TabsContent value="completed">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                        {tasks
                            ?.filter((task) => task.status === "completed")
                            .map((task) => (
                                <TaskCard key={task._id} task={task} />
                            ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
