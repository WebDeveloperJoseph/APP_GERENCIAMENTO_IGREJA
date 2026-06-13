import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { uploadsDirectory } from "./modules/uploads/upload.config";

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));

app.use(routes);

app.use(errorHandler);

export { app };
