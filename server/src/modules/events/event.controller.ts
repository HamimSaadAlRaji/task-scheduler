import { Request, Response } from "express";
import * as eventService from "./event.service";
import { IEvent } from "./event.model";

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const events = await eventService.getEventsByUserId(userId.toString());
  return res.status(200).json(events);
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, description, startDate, endDate, tasks } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || !description) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const eventData = {
    title,
    description,
    startDate,
    endDate,
    createdBy: userId,
    tasks: tasks || [],
  };
  const newEvent = await eventService.createEvent(eventData as IEvent);
  return res.status(201).json(newEvent);
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the event belongs to the user
  const existingEvent = await eventService.getEventById(id);
  if (!existingEvent) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (existingEvent.createdBy.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  await eventService.deleteEvent(id);
  return res.status(200).json({ message: "Event Deleted Successfully" });
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const eventBody = req.body;
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the event belongs to the user
  const existingEvent = await eventService.getEventById(id);
  if (!existingEvent) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (existingEvent.createdBy.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  await eventService.updateEvent(id, eventBody);
  return res.status(200).json({ message: "Event Updated Successfully" });
};
