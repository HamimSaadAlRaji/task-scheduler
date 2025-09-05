import { Event, IEvent } from "./event.model";

export const getAllEvents = async () => {
  return await Event.find().populate("createdBy", "username").populate("tasks");
};

export const getEventsByUserId = async (userId: string) => {
  return await Event.find({ createdBy: userId })
    .populate("createdBy", "username")
    .populate("tasks");
};

export const getEventById = async (id: string) => {
  return await Event.findById(id)
    .populate("createdBy", "username")
    .populate("tasks");
};

export const createEvent = async (eventData: IEvent) => {
  const newEvent = new Event(eventData);
  return await newEvent.save();
};

export const updateEvent = async (id: string, eventData: Partial<IEvent>) => {
  return await Event.findByIdAndUpdate(id, eventData, { new: true })
    .populate("createdBy", "username")
    .populate("tasks");
};

export const deleteEvent = async (id: string) => {
  return await Event.findByIdAndDelete(id);
};
