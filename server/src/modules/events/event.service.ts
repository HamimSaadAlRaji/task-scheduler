import { Event } from "./event.model";

export const getAllEvents = async () => {
  return await Event.find().populate("createdBy", "name").populate("tasks");
};
