import { Router } from "express";

import { authCustomerMiddleware } from "./app/middlewares/authMiddleware";

import CustomerController from "./app/controllers/CustomerController";
import AuthController from "./app/controllers/AuthController";
import ProductController from "./app/controllers/ProductController";
import CityController from "./app/controllers/CityController";
import SearchController from "./app/controllers/SearchController";
import CartController from "./app/controllers/CartController";
import AddressController from "./app/controllers/AddressController";

const router = Router();

// Customer
router.post("/customer", CustomerController.store);
router.get("/customer", authCustomerMiddleware, CustomerController.show);
router.put("/customer", authCustomerMiddleware, CustomerController.update);
router.delete("/customer", authCustomerMiddleware, CustomerController.delete);

// Login (authenticate)
router.post("/login", AuthController.authenticateCustomer);

// Product
router.get("/product", authCustomerMiddleware, ProductController.index);
router.get("/product/:id", authCustomerMiddleware, ProductController.show);

// City
router.get("/city", CityController.index);
router.get("/city/:id", CityController.show);

// CEP
router.post("/searchAddress", SearchController.search);

// Address
router.post("/address", authCustomerMiddleware, AddressController.store);
router.get("/address", authCustomerMiddleware, AddressController.index);
router.put("/address/:id", authCustomerMiddleware, AddressController.update);
router.delete("/address/:id", authCustomerMiddleware, AddressController.delete);

// Cart
router.post("/cart", authCustomerMiddleware, CartController.store);
router.get("/cart", authCustomerMiddleware, CartController.index);
router.get("/cart/:id", authCustomerMiddleware, CartController.show);
router.delete("/cart/:id", authCustomerMiddleware, CartController.delete);

export default router;