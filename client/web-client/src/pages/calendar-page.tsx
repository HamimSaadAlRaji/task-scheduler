import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import type { Task, Event } from "@/lib/types";
import TaskCard from "@/components/tasks/task-card";
import AddEventDialog from "@/components/events/add-event-dialog";
import EventActions from "@/components/events/event-actions";
import EventTasksManagement from "@/components/events/event-tasks-management";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users, UserIcon } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Fetch real tasks
  const fetchTasks = async (): Promise<Task[]> => {
    const resp = await axiosInstance.get("/tasks");
    return resp.data;
  };

  const { data: tasks } = useQuery({
    queryFn: fetchTasks,
    queryKey: ["tasks"],
  });

  // Fetch real events
  const fetchEvents = async (): Promise<Event[]> => {
    const resp = await axiosInstance.get("/events");
    return resp.data;
  };

  const { data: events } = useQuery({
    queryFn: fetchEvents,
    queryKey: ["events"],
  });

  const getEventTypeColor = (event: Event) => {
    if (event.type) {
      const typeColors = {
        meeting: "bg-blue-500",
        focus: "bg-purple-500",
        break: "bg-orange-500",
        personal: "bg-green-500",
      };
      return typeColors[event.type];
    }
    // Default color based on event characteristics
    if (event.meetingLink) return "bg-blue-500";
    if (event.tasks && event.tasks.length > 0) return "bg-purple-500";
    return "bg-gray-500";
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);

    if (now >= eventStart && now <= eventEnd) {
      return { status: "live", color: "bg-red-100 text-red-600" };
    } else if (now < eventStart) {
      const timeDiff = eventStart.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      if (minutesDiff <= 15) {
        return {
          status: "starting-soon",
          color: "bg-orange-100 text-orange-600",
        };
      }
      return { status: "upcoming", color: "bg-blue-100 text-blue-600" };
    } else {
      return { status: "completed", color: "bg-gray-100 text-gray-600" };
    }
  };

  const formatDateTime = (date: Date) => {
    return format(new Date(date), "hh:mm a");
  };

  const getDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMinutes = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  // Filter events and tasks for selected date
  const selectedDateEvents =
    events?.filter((event) => {
      if (!selectedDate) return false;
      return isSameDay(new Date(event.startDate), selectedDate);
    }) || [];

  const selectedDateTasks =
    tasks?.filter((task) => {
      if (!selectedDate || !task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), selectedDate);
    }) || [];

  // Sort events by start time
  const sortedEvents = selectedDateEvents.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Calendar & Scheduling</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your schedule and optimize your time
          </p>
        </div>
        <AddEventDialog />
      </div>

      <div className="flex gap-6 w-full">
        {/* Calendar Sidebar */}
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Select a date to view events and tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />

            {/* Quick Stats */}
            <div className="mt-6 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Total Events: </span>
                <span>{events?.length || 0}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Total Tasks: </span>
                <span>{tasks?.length || 0}</span>
              </div>
              {selectedDate && (
                <>
                  <div className="text-sm">
                    <span className="font-medium">
                      Events on {format(selectedDate, "MMM dd")}:{" "}
                    </span>
                    <span>{selectedDateEvents.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      Tasks due on {format(selectedDate, "MMM dd")}:{" "}
                    </span>
                    <span>{selectedDateTasks.length}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events and Tasks List */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              Schedule for{" "}
              {selectedDate
                ? format(selectedDate, "EEEE, MMMM dd, yyyy")
                : "Today"}
            </CardTitle>
            <CardDescription>
              Your events and tasks for the selected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Events Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Events</h3>
                  {selectedDate && (
                    <Badge variant="outline">
                      {selectedDateEvents.length} event
                      {selectedDateEvents.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                {sortedEvents.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No events scheduled for this date
                    </p>
                    <AddEventDialog />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedEvents.map((event) => {
                      const eventStatus = getEventStatus(event);
                      return (
                        <div
                          key={event._id}
                          className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${getEventTypeColor(
                              event
                            )} mt-2`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-base">
                                {event.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`text-xs ${eventStatus.color}`}
                              >
                                {eventStatus.status
                                  .replace("-", " ")
                                  .toUpperCase()}
                              </Badge>
                              {event.type && (
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {event.type}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDateTime(event.startDate)} -{" "}
                                {formatDateTime(event.endDate)}
                                <span className="ml-1">
                                  ({getDuration(event.startDate, event.endDate)}
                                  )
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {event.location}
                                </div>
                              )}
                              {event.attendees &&
                                event.attendees.length > 0 && (
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {event.attendees.length} attendee
                                    {event.attendees.length !== 1 ? "s" : ""}
                                  </div>
                                )}
                              <div className="flex items-center">
                                <UserIcon className="w-4 h-4 mr-1" />
                                {event.createdBy?.username || "Unknown"}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <EventTasksManagement event={event} />
                              <EventActions event={event} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tasks Section */}
              {selectedDateTasks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Tasks Due</h3>
                    <Badge variant="outline">
                      {selectedDateTasks.length} task
                      {selectedDateTasks.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {selectedDateTasks.map((task) => (
                      <div key={task._id} className="transform scale-95">
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state when no events or tasks */}
              {sortedEvents.length === 0 && selectedDateTasks.length === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nothing scheduled
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No events or tasks for{" "}
                    {selectedDate
                      ? format(selectedDate, "MMMM dd, yyyy")
                      : "this date"}
                  </p>
                  <AddEventDialog />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
