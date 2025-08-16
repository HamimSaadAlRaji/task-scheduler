import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/dialog'
import { Button } from '../components/button';
import { Label } from '../components/label';
import { Input } from '../components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/select';
import { Textarea } from '../components/textarea';
import { Plus, Brain, Users, Video } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card';
import { Calendar } from '../components/calendar';
interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    duration: number;
    type: 'meeting' | 'focus' | 'break' | 'personal';
    location?: string;
    attendees?: string[];
    aiSuggested?: boolean;
}

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([
        {
            id: '1',
            title: 'Daily Standup',
            description: 'Team sync meeting',
            date: new Date(),
            time: '09:00 AM',
            duration: 30,
            type: 'meeting',
            location: 'Conference Room A',
            attendees: ['John', 'Sarah', 'Mike'],
            aiSuggested: false
        },
        {
            id: '2',
            title: 'Focus Session: Deep Work',
            description: 'Concentrated work time for project proposal',
            date: new Date(),
            time: '10:30 AM',
            duration: 90,
            type: 'focus',
            aiSuggested: true
        },
        {
            id: '3',
            title: 'Project Review',
            description: 'Review Q1 project deliverables',
            date: new Date(),
            time: '02:00 PM',
            duration: 60,
            type: 'meeting',
            location: 'Virtual - Google Meet',
            attendees: ['Team Lead', 'Product Manager']
        }
    ]);

    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        time: '',
        duration: 60,
        type: 'meeting' as const,
        location: ''
    });

    const addEvent = () => {
        const event: Event = {
            id: Date.now().toString(),
            ...newEvent,
            date: selectedDate || new Date(),
            attendees: []
        };
        setEvents([...events, event]);
        setNewEvent({
            title: '',
            description: '',
            time: '',
            duration: 60,
            type: 'meeting',
            location: ''
        });
        setIsDialogOpen(false);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Calendar & Scheduling</h1>
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
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="Enter event title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
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
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration">Duration (minutes)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={newEvent.duration}
                                        onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                                        min="15"
                                        max="480"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="type">Type</Label>
                                <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({ ...newEvent, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="meeting">Meeting</SelectItem>
                                        <SelectItem value="focus">Focus Session</SelectItem>
                                        <SelectItem value="break">Break</SelectItem>
                                        <SelectItem value="personal">Personal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
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
                                <Button variant="outline" className="w-full justify-start">
                                    <Brain className="w-4 h-4 mr-2" />
                                    AI Schedule Optimization
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="w-4 h-4 mr-2" />
                                    Find Team Availability
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Video className="w-4 h-4 mr-2" />
                                    Create Google Meet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default CalendarPage