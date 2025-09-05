import { CalendarIcon, ClockIcon, UsersIcon } from "lucide-react";
import AddEventDialog from "@/components/events/add-event-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/types";
import EventCard from "@/components/events/event-card";
import { isBefore, isToday, startOfDay } from "date-fns";

export default function EventsPage() {
  const fetchEvents = async (): Promise<Event[]> => {
    const resp = await axiosInstance.get("/events");
    return resp.data;
  };

  const { data: events } = useQuery({
    queryFn: fetchEvents,
    queryKey: ["events"],
  });

  const today = startOfDay(new Date());

  const upcomingEvents =
    events?.filter((event) => !isBefore(new Date(event.startDate), today)) ||
    [];

  const pastEvents =
    events?.filter((event) => isBefore(new Date(event.startDate), today)) || [];

  const todayEvents =
    events?.filter((event) => isToday(new Date(event.startDate))) || [];

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <AddEventDialog />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-[300px] bg-blue-50 border border-blue-100 mb-6">
          <TabsTrigger value="upcoming">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            <span>Upcoming</span>
          </TabsTrigger>
          <TabsTrigger value="today">
            <ClockIcon className="w-4 h-4 text-green-500" />
            <span>Today</span>
          </TabsTrigger>
          <TabsTrigger value="past">
            <UsersIcon className="w-4 h-4 text-gray-500" />
            <span>Past</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {upcomingEvents.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No upcoming events found
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="today">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {todayEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {todayEvents.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No events scheduled for today
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
            {pastEvents.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No past events found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
