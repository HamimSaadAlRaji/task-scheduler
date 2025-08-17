import express from "express";
import cors from "cors";
import { router as apiRouter } from "./routes/index";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => res.send("Task Scheduler API running"));

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
