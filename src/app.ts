import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./api.routes";
import adminRoutes from "./admin.routes";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.use("/admin", adminRoutes);

export default app;