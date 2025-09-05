import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import type { Event, Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, ListIcon, TrashIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventTasksManagementProps {
  event: Event;
}

export default function EventTasksManagement({
  event,
}: EventTasksManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const queryClient = useQueryClient();

  // Fetch all available tasks
  const { data: allTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<Task[]> => {
      const resp = await axiosInstance.get("/tasks");
      return resp.data;
    },
  });

  // Get tasks not already linked to this event
  const availableTasks =
    allTasks?.filter(
      (task) => !event.tasks.some((eventTask) => eventTask._id === task._id)
    ) || [];

  // Add task to event
  const addTaskToEvent = useMutation({
    mutationFn: async (taskId: string) => {
      const currentTaskIds = event.tasks.map((t) => t._id);
      return await axiosInstance.put(`/events/${event._id}`, {
        ...event,
        tasks: [...currentTaskIds, taskId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setSelectedTaskId("");
    },
    onError: (error) => {
      console.error("Error adding task to event:", error);
    },
  });

  // Remove task from event
  const removeTaskFromEvent = useMutation({
    mutationFn: async (taskId: string) => {
      const currentTaskIds = event.tasks.map((t) => t._id);
      const updatedTaskIds = currentTaskIds.filter((id) => id !== taskId);
      return await axiosInstance.put(`/events/${event._id}`, {
        ...event,
        tasks: updatedTaskIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error("Error removing task from event:", error);
    },
  });

  const handleAddTask = () => {
    if (selectedTaskId) {
      addTaskToEvent.mutate(selectedTaskId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100";
      case "medium":
        return "text-yellow-500 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-orange-500 bg-orange-100";
      case "todo":
        return "text-blue-500 bg-blue-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ListIcon className="w-4 h-4 mr-1" />
          Tasks ({event.tasks.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Event Tasks</DialogTitle>
          <DialogDescription>
            Link tasks to this event: {event.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Task */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Task to Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Select
                  value={selectedTaskId}
                  onValueChange={setSelectedTaskId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a task to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTasks.map((task) => (
                      <SelectItem key={task._id} value={task._id}>
                        <div className="flex items-center gap-2">
                          <span>{task.title}</span>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddTask}
                  disabled={!selectedTaskId || addTaskToEvent.isPending}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {availableTasks.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No available tasks to add. All tasks are already linked to
                  this event or you have no tasks created.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Current Event Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Linked Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {event.tasks.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tasks linked to this event yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {event.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getStatusColor(task.status)}
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {task.description}
                        </p>
                        {task.dueDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTaskFromEvent.mutate(task._id)}
                        disabled={removeTaskFromEvent.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
