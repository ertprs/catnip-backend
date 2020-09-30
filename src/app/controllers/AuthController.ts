import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import connection from "../../database/connection";

class AuthController {
  async authenticateCustomer(request: Request, response: Response) {
    const auth = request.headers.authorization;

    if(auth != process.env.AUTH_TOKEN) return response.sendStatus(401);

    const { email, password } = request.body;

    const customer = await connection("customer").where({ email }).select("id", "password").first();
    
    if(!customer) return response.sendStatus(401);

    const isValidPassword = await bcrypt.compare(password, customer.password);

    if(!isValidPassword) return response.sendStatus(401);

    const token = jwt.sign({ id: customer.id }, process.env.ACCESS_TOKEN_CUSTOMER || "");

    return response.status(200).json({ 
      customer: { 
        id: customer.id, 
        email 
      }, 
      token 
    });
  }

  async authenticateUser(request: Request, response: Response) {
    const auth = request.headers.authorization;
    
    if(auth != process.env.AUTH_TOKEN) return response.sendStatus(401);
    
    const { email, password } = request.body;

    const user = await connection("user").where({ email }).select("id", "password").first();

    if(!user) return response.sendStatus(401);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if(!isValidPassword) return response.sendStatus(401);

    const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_USER || "");

    return response.status(200).json({ 
      user: { 
        id: user.id, 
        email 
      }, 
      token 
    });
  }  
}

export default new AuthController();