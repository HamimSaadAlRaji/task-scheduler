import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  VideoIcon,
  BellIcon,
  ExternalLinkIcon,
  CheckIcon,
  AlertCircleIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EventActionsProps {
  event: Event;
}

export default function EventActions({ event }: EventActionsProps) {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState(event.meetingLink || "");

  const queryClient = useQueryClient();

  // Update event with meeting link
  const updateMeetingLink = useMutation({
    mutationFn: async (link: string) => {
      return await axiosInstance.put(`/events/${event._id}`, {
        ...event,
        meetingLink: link,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setVideoDialogOpen(false);
      toast.success("Meeting link updated successfully");
    },
    onError: (error) => {
      console.error("Error updating meeting link:", error);
      toast.error("Failed to update meeting link");
    },
  });

  // Send notification
  const sendNotification = useMutation({
    mutationFn: async () => {
      // In a real app, this would send notifications to attendees
      // For now, we'll just update the event to mark notification as sent
      return await axiosInstance.put(`/events/${event._id}`, {
        ...event,
        notificationSent: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Notification sent to attendees");
    },
    onError: (error) => {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    },
  });

  const generateMeetingLink = () => {
    // Generate a Google Meet-style link for demo purposes
    const roomId = Math.random().toString(36).substring(2, 12);
    const generatedLink = `https://meet.google.com/${roomId}`;
    setMeetingLink(generatedLink);
  };

  const handleJoinCall = () => {
    if (event.meetingLink) {
      window.open(event.meetingLink, "_blank");
    } else {
      toast.error("No meeting link available for this event");
    }
  };

  const handleSaveMeetingLink = () => {
    if (meetingLink.trim()) {
      updateMeetingLink.mutate(meetingLink.trim());
    }
  };

  const isEventStartingSoon = () => {
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const timeDiff = eventStart.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    return minutesDiff <= 15 && minutesDiff >= -30; // 15 minutes before to 30 minutes after
  };

  const isEventLive = () => {
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    return now >= eventStart && now <= eventEnd;
  };

  return (
    <div className="flex space-x-2">
      {/* Notification Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => sendNotification.mutate()}
        disabled={sendNotification.isPending}
        className={event.notificationSent ? "text-green-600" : ""}
      >
        {event.notificationSent ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <BellIcon className="w-4 h-4" />
        )}
        {sendNotification.isPending
          ? "Sending..."
          : event.notificationSent
          ? "Sent"
          : "Notify"}
      </Button>

      {/* Video Call Button */}
      {event.meetingLink ? (
        <Button
          size="sm"
          variant={isEventLive() ? "default" : "outline"}
          onClick={handleJoinCall}
          className={
            isEventLive() ? "bg-green-600 hover:bg-green-700 animate-pulse" : ""
          }
        >
          <VideoIcon className="w-4 h-4 mr-1" />
          {isEventLive() ? "Join Now" : "Join Call"}
          <ExternalLinkIcon className="w-3 h-3 ml-1" />
        </Button>
      ) : (
        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <VideoIcon className="w-4 h-4 mr-1" />
              Setup Call
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Setup Video Call</DialogTitle>
              <DialogDescription>
                Add a meeting link for this event
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meetingLink">Meeting Link</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="meetingLink"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateMeetingLink}
                  >
                    Generate
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setVideoDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveMeetingLink}
                  disabled={!meetingLink.trim() || updateMeetingLink.isPending}
                >
                  {updateMeetingLink.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Live indicator */}
      {isEventLive() && (
        <div className="flex items-center px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
          LIVE
        </div>
      )}

      {/* Starting soon indicator */}
      {isEventStartingSoon() && !isEventLive() && (
        <div className="flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
          <AlertCircleIcon className="w-3 h-3 mr-1" />
          Starting Soon
        </div>
      )}
    </div>
  );
}
