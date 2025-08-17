import { Request, Response } from "express";
import * as userService from "./user.service";

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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await userService.getUser(email);
  if (!user) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid password" });
    return;
  }
  const accessToken = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json({ message: "Login successful" });
  return;
};
export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("accessToken", options);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
