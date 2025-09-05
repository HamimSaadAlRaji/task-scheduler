import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, UserIcon, ListIcon } from "lucide-react";
import DeleteEventDialog from "./delete-event-dialog";
import EditEventDialog from "./edit-event-dialog";

export default function EventCard({ event }: { event: Event }) {
  const isPastEvent = new Date(event.endDate) < new Date();
  const isOngoing =
    new Date(event.startDate) <= new Date() &&
    new Date() <= new Date(event.endDate);

  const formatDateTime = (date: Date) => {
    return format(new Date(date), "MMM dd, yyyy 'at' hh:mm a");
  };

  const getDuration = () => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const diffInHours = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes}m`;
    }
    return diffInHours === 1 ? "1 hour" : `${diffInHours} hours`;
  };

  return (
    <Card
      className={`mb-4 ${
        isPastEvent
          ? "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20"
          : isOngoing
          ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
          : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex-1">
          <CardTitle
            className={`flex items-center text-base font-medium ${
              isPastEvent ? "text-gray-600 dark:text-gray-400" : ""
            }`}
          >
            {event.title}
          </CardTitle>
          <CardDescription className="mt-1">
            {event.description}
          </CardDescription>
        </div>
        <div className="flex gap-1">
          {isOngoing && (
            <Badge variant="outline" className="text-green-600 bg-green-100">
              Live
            </Badge>
          )}
          {isPastEvent && (
            <Badge variant="outline" className="text-gray-600 bg-gray-100">
              Past
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDateTime(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>Duration: {getDuration()}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Created by: {event.createdBy?.username || "Unknown"}</span>
          </div>
          {event.tasks && event.tasks.length > 0 && (
            <div className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              <span>
                {event.tasks.length} linked task
                {event.tasks.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <EditEventDialog event={event} />
          <DeleteEventDialog eventId={event._id} />
        </div>
      </CardContent>
    </Card>
  );
}
