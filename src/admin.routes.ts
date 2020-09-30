import { Router } from "express";

import { authUserMiddleware } from "./app/middlewares/authMiddleware";

import UserController from "./app/controllers/UserController";
import AuthController from "./app/controllers/AuthController";
import ProductController from "./app/controllers/ProductController";
import CityController from "./app/controllers/CityController";

const adminRouter = Router();

// User
adminRouter.post("/user", UserController.store);
adminRouter.get("/user", authUserMiddleware, UserController.show);
adminRouter.put("/user", authUserMiddleware, UserController.update);
adminRouter.delete("/user", authUserMiddleware, UserController.delete);

// Login (authenticate)
adminRouter.post("/login", AuthController.authenticateUser);

// Product
adminRouter.post("/product", authUserMiddleware, ProductController.store);
// adminRouter.get("/product", authUserMiddleware, ProductController.index);
// adminRouter.get("/product/:id", authUserMiddleware, ProductController.show);
adminRouter.put("/product/:id", authUserMiddleware, ProductController.update);
adminRouter.patch("/product/:id", authUserMiddleware, ProductController.patch);
adminRouter.delete("/product/:id", authUserMiddleware, ProductController.delete);

export default adminRouter;