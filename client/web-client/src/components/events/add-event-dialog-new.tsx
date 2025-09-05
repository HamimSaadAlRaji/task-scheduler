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
import { CalendarIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { axiosInstance } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddEventDialog() {
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

  const defaultValues = {
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const addEvent = async (event: z.infer<typeof formSchema>) => {
    return await axiosInstance.post("/events/create-event", {
      ...event,
      createdBy: "66e7cb4c34ae21dc16a5bc69", // This should come from auth context
      tasks: [],
    });
  };

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      form.reset(defaultValues);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error adding event:", error);
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sidebar-accent hover:bg-blue-500 transition-colors duration-200">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event for your schedule
          </DialogDescription>
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
              Add Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
