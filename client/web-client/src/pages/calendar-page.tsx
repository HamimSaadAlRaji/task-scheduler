// Add these imports to your CalendarPage
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { CheckCircleIcon, ClipboardListIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCard from "@/components/tasks/task-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    Plus,
    Brain,
    Users,
    Video,
    Clock,
    MapPin,
    Bell,
    CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    duration: number;
    type: "meeting" | "focus" | "break" | "personal";
    location?: string;
    attendees?: string[];
    aiSuggested?: boolean;
}

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    const fetchTasks = async (): Promise<Task[]> => {
        const resp = await axiosInstance.get("/tasks");
        return resp.data;
    };

    const { data: tasks } = useQuery({
        queryFn: fetchTasks,
        queryKey: ["tasks"],
    });

    const [events, setEvents] = useState<Event[]>([
        {
            id: "1",
            title: "Daily Standup",
            description: "Team sync meeting",
            date: new Date(),
            time: "09:00 AM",
            duration: 30,
            type: "meeting",
            location: "Conference Room A",
            attendees: ["John", "Sarah", "Mike"],
            aiSuggested: false,
        },
        {
            id: "2",
            title: "Focus Session: Deep Work",
            description: "Concentrated work time for project proposal",
            date: new Date(),
            time: "10:30 AM",
            duration: 90,
            type: "focus",
            aiSuggested: true,
        },
        {
            id: "3",
            title: "Project Review",
            description: "Review Q1 project deliverables",
            date: new Date(),
            time: "02:00 PM",
            duration: 60,
            type: "meeting",
            location: "Virtual - Google Meet",
            attendees: ["Team Lead", "Product Manager"],
        },
    ]);

    const typeColors = {
        meeting: "bg-blue-500",
        focus: "bg-purple-500",
        break: "bg-orange-500",
        personal: "bg-green-500",
    };

    const todaysEvents = events.filter(
        (event) =>
            event.date.toDateString() ===
            (selectedDate || new Date()).toDateString()
    );

    const todaysTasks = tasks?.filter((task) => {
        if (!selectedDate || !task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toDateString();
        return taskDate === selectedDate.toDateString();
    });

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Calendar & Scheduling
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your schedule and optimize your time
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-between mb-8">
                <div className="lg:flex gap-6 w-full">
                    {/* Calendar */}
                    <Card className="">
                        <CardHeader>
                            <CardTitle>
                                Events & Tasks for{" "}
                                {selectedDate
                                    ? format(selectedDate, "MMMM dd, yyyy")
                                    : "Today"}
                            </CardTitle>
                            <CardDescription>
                                Your scheduled events and due tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                            {todaysTasks && todaysTasks.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-semibold mb-3">Tasks Due Today</h4>
                                    <div className="space-y-3">
                                        {todaysTasks.map((task) => (
                                            <div key={task._id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{task.title}</span>
                                                    <Badge variant={task.status === "completed" ? "secondary" : "default"}>
                                                        {task.status}
                                                    </Badge>
                                                </div>
                                                {task.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Events List */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>
                                Events for{" "}
                                {selectedDate
                                    ? format(selectedDate, "MMMM dd, yyyy")
                                    : "Today"}
                            </CardTitle>
                            <CardDescription>
                                Your scheduled events and activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {todaysEvents.length === 0 ? (
                                    <div className="text-center py-8">
                                        <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            No events scheduled for this day
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                        // onClick={() =>
                                        //     setIsDialogOpen(true)
                                        // }
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Event
                                        </Button>
                                    </div>
                                ) : (
                                    todaysEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div
                                                className={`w-3 h-3 rounded-full ${typeColors[event.type]
                                                    } mt-2`}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-medium">
                                                        {event.title}
                                                    </h3>
                                                    {event.aiSuggested && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <Brain className="w-3 h-3 mr-1" />
                                                            AI
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs capitalize"
                                                    >
                                                        {event.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {event.description}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {event.time} (
                                                        {event.duration} min)
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center">
                                                            <MapPin className="w-4 h-4 mr-1" />
                                                            {event.location}
                                                        </div>
                                                    )}
                                                    {event.attendees &&
                                                        event.attendees.length >
                                                        0 && (
                                                            <div className="flex items-center">
                                                                <Users className="w-4 h-4 mr-1" />
                                                                {
                                                                    event
                                                                        .attendees
                                                                        .length
                                                                }{" "}
                                                                attendees
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Bell className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Video className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
