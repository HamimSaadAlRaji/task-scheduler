import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { axiosInstance } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DeleteTaskDialog({ taskId }: { taskId: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const deleteTask = async () => {
        return await axiosInstance.delete("/tasks/" + taskId);
    };

    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            setIsDialogOpen(false);
        },
        onError: (error) => {
            console.error("Error adding task:", error);
        },
    });

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Trash2Icon className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this task? This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={() => {
                                    mutateAsync();
                                }}
                                className="bg-red-600 hover:bg-red-500 transition-colors duration-200"
                            >
                                Confirm
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
