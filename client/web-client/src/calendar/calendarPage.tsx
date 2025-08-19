import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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

    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        time: "",
        duration: 60,
        type: "meeting" as const,
        location: "",
    });

    const addEvent = () => {
        const event: Event = {
            id: Date.now().toString(),
            ...newEvent,
            date: selectedDate || new Date(),
            attendees: [],
        };
        setEvents([...events, event]);
        setNewEvent({
            title: "",
            description: "",
            time: "",
            duration: 60,
            type: "meeting",
            location: "",
        });
        setIsDialogOpen(false);
    };

    const todaysEvents = events.filter(
        (event) =>
            event.date.toDateString() ===
            (selectedDate || new Date()).toDateString()
    );

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Calendar & Scheduling
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your schedule and optimize your time
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                            <DialogDescription>
                                Schedule a new event or meeting
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={newEvent.title}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Enter event title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newEvent.description}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Enter event description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                time: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration">
                                        Duration (minutes)
                                    </Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={newEvent.duration}
                                        onChange={(e) =>
                                            setNewEvent({
                                                ...newEvent,
                                                duration: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        min="15"
                                        max="480"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={newEvent.type}
                                    onValueChange={(value: any) =>
                                        setNewEvent({
                                            ...newEvent,
                                            type: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="meeting">
                                            Meeting
                                        </SelectItem>
                                        <SelectItem value="focus">
                                            Focus Session
                                        </SelectItem>
                                        <SelectItem value="break">
                                            Break
                                        </SelectItem>
                                        <SelectItem value="personal">
                                            Personal
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={newEvent.location}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            location: e.target.value,
                                        })
                                    }
                                    placeholder="Meeting room, virtual link, etc."
                                />
                            </div>
                            <Button onClick={addEvent} className="w-full">
                                Create Event
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Calendar</CardTitle>
                            <CardDescription>
                                Select a date to view events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />

                            <div className="mt-6 space-y-3">
                                <h3 className="font-medium">Quick Actions</h3>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Brain className="w-4 h-4 mr-2" />
                                    AI Schedule Optimization
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Find Team Availability
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Video className="w-4 h-4 mr-2" />
                                    Create Google Meet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Events List */}
                    <Card className="lg:col-span-2">
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
                                            onClick={() =>
                                                setIsDialogOpen(true)
                                            }
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
                                                className={`w-3 h-3 rounded-full ${
                                                    typeColors[event.type]
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

                {/* AI Suggestions */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Brain className="w-5 h-5 mr-2" />
                            AI Schedule Insights
                        </CardTitle>
                        <CardDescription>
                            Intelligent recommendations for your calendar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                                    Optimal Meeting Time
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                    Tuesday 2-4 PM works best for all team
                                    members based on their availability
                                    patterns.
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <h3 className="font-medium text-purple-900 dark:text-purple-100">
                                    Focus Block Suggestion
                                </h3>
                                <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                                    Schedule a 2-hour focus block tomorrow
                                    morning when your productivity typically
                                    peaks.
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <h3 className="font-medium text-green-900 dark:text-green-100">
                                    Break Reminder
                                </h3>
                                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                                    You have 4 consecutive meetings. Consider
                                    adding a 15-minute break between them.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default CalendarPage;
