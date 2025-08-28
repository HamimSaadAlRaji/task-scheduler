import { Request, Response } from "express";
import * as eventService from "./event.service";
import { IEvent } from "./event.model";

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const events = await eventService.getAllEvents();
  return res.status(200).json(events);
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, description, startDate, endDate, createdBy, tasks } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const eventData = {
    title,
    description,
    startDate,
    endDate,
    createdBy,
    tasks,
  };
  const newEvent = await eventService.createEvent(eventData as IEvent);
  return res.status(201).json(newEvent);
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  await eventService.deleteEvent(id);
  return res.status(200).json({ message: "Event Deleted Successfully" });
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const eventBody = req.body;
  const { id } = req.params;
  await eventService.updateEvent(id, eventBody);
  return res.status(200).json({ message: "Event Updated Successfully" });
};
