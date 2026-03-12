import express from "express";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", messageRoutes);

app.use(errorHandler);

export default app;