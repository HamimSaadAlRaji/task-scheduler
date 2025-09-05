import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, EditIcon } from "lucide-react";
import { format } from "date-fns";
import { axiosInstance } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Event } from "@/lib/types";

interface EditEventDialogProps {
  event: Event;
}

export default function EditEventDialog({ event }: EditEventDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formSchema = z
    .object({
      title: z.string().min(1, { message: "Title is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      startDate: z.date(),
      endDate: z.date(),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: "End date must be after start date",
      path: ["endDate"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    },
  });

  const updateEvent = async (eventData: z.infer<typeof formSchema>) => {
    return await axiosInstance.put(`/events/${event._id}`, eventData);
  };

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating event:", error);
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <EditIcon className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update the event details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutateAsync(values))}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter event title" />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter event description"
                    />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(field.value, "PPP p")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => date && field.onChange(date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(field.value, "PPP p")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => date && field.onChange(date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-sidebar-accent hover:bg-blue-500 transition-colors duration-200 mt-4"
            >
              Update Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
