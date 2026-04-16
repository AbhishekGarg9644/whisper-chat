import express from "express";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        /^http:\/\/localhost(:\d+)?$/, // any localhost port (5173, 5174, 8081, etc.)
        /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/, // any local network IP (for mobile dev)
        process.env.FRONTEND_URL, // production URL
      ].filter(Boolean);

      const isAllowed = allowedOrigins.some((pattern) =>
        typeof pattern === "string" ? pattern === origin : (pattern as RegExp).test(origin)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json()); // parses incoming JSON request bodies and makes them available as req.body in your route handlers

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// error handlers must come after all the routes and other middlewares so they can catch errors passed with next(err) or thrown inside async handlers.
app.use(errorHandler);

// serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../web/dist")));

  app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(__dirname, "../../web/dist/index.html"));
  });
}

export default app;
