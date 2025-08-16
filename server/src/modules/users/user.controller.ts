import { Request, Response } from "express";
import * as userService from "./user.service";
import { createUser } from "./user.service";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    if (await userService.doesUserExist(email)) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const user = await userService.createUser({ username, email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
