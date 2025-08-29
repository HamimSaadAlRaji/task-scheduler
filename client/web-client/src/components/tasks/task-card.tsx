import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import DeleteTaskDialog from "./delete-task-dialog";
import EditTaskDialog from "./edit-task-dialog";

export default function TaskCard({ task }: { task: Task }) {
    const priorityColors = {
        high: "text-red-500 bg-red-100",
        medium: "text-yellow-500 bg-yellow-100",
        low: "text-green-600 bg-green-100",
    };
    const isDone = task.status === "completed";

    async function updateStatus() {
        return await axiosInstance.put("/tasks/" + task._id, {
            status: isDone ? "todo" : "completed",
        });
    }
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
        mutationFn: updateStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    return (
        <Card
            key={task._id}
            className={`mb-4${
                isDone
                    ? " border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                    : ""
            }`}
        >
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center">
                    <CardTitle
                        className={`flex items-center text-base font-medium${
                            isDone
                                ? " line-through text-gray-600 dark:text-gray-400"
                                : ""
                        }`}
                    >
                        {task.title}
                    </CardTitle>
                </div>
                <Badge
                    variant={"outline"}
                    className={priorityColors[task.priority]}
                >
                    {task.priority}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
                <CardDescription
                    className={`min-h-10 text-sm text-gray-600 dark:text-gray-400${
                        isDone ? " line-through" : ""
                    } break-words whitespace-pre-line`}
                >
                    {task.description.length > 125
                        ? `${task.description.slice(0, 125)} ...`
                        : task.description}
                </CardDescription>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        {format(task.dueDate, "MMM dd, yyyy")}
                    </span>
                </div>
                <div className="flex space-x-2 mt-4">
                    <Button
                        size="sm"
                        className="flex-1 text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200"
                        onClick={() => mutateAsync()}
                    >
                        {isDone ? "Mark As To Do" : "Mark As Done"}
                    </Button>
                    <EditTaskDialog task={task} />
                    <DeleteTaskDialog taskId={task._id} />
                </div>
            </CardContent>
        </Card>
    );
}
