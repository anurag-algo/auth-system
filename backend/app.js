import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

export default app;
