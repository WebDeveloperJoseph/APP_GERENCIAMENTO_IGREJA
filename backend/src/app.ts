import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { routes } from "./routes";
import { csrfProtection } from "./middlewares/csrfProtection";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.set("trust proxy", 1);

// Security middlewares
app.use(helmet());

// Basic rate limiter for all requests (adjust as needed)
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120, // limit each IP to 120 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skip: (request) => request.path === "/webhooks/asaas",
  }),
);

// CORS configuration: read allowed origins from env or fallback to localhost and production domain
const allowed = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:3000,http://127.0.0.1:3000,https://app-gerenciamento-igreja.onrender.com"
)
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowed.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-church-id",
      "x-csrf-token",
    ],
  }),
);

// Set strict CSP with frame-ancestors via HTTP header (meta tag not sufficient).
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; connect-src 'self' https://app-gerenciamento-igreja.onrender.com; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-ancestors 'none';",
  );
  // HSTS for production
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(csrfProtection);
app.use(routes);

app.use(errorHandler);

export { app };
