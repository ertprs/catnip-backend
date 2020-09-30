import { Request, Response } from "express";
import moment from "moment";
import bcrypt from "bcryptjs";

import connection from "../../database/connection";

class UserController {
  async store(request: Request, response: Response) {
    const auth = request.headers.authorization;
    
    if(auth != process.env.AUTH_TOKEN) return response.sendStatus(401);

    const { name, email, password } = request.body;

    const userExists = await connection("user").where({ email }).select("email").first();

    if(userExists) return response.status(409).json({ error: "E-mail already exists", email });

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      created_at: now,
      updated_at: now
    };

    const insertedIds = await connection("user").insert(user);
    const id = insertedIds[0];

    return response.status(201).json({ 
      id, 
      name, 
      email, 
      created_at: user.created_at, 
      updated_at: user.updated_at 
    });    
  }

  async show(request: Request, response: Response) {
    const user = await connection("user")
      .where("id", request.userId)
      .select(
        "id",
        "name",
        "email",
        "created_at",
        "updated_at"
      )
      .first();

    return response.status(200).json(user);
  }

  async update(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const userExists = await connection("user").where("id", request.userId).select("id").first();

    if(!userExists) return response.status(404).json({ error: "User not found", id: request.userId });

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      updated_at: now
    };

    await connection("user").where("id", request.userId).update(user);
    
    return response.status(201).json({ 
      id: request.userId, 
      name, 
      email,
      updated_at: user.updated_at 
    });     
  }
  
  async delete(request: Request, response: Response) {
    const user = await connection("user").where("id", request.userId).del();

    if(!user) return response.status(404).json({ error: "User not found", id: request.userId });

    return response.sendStatus(200);
  }
}

export default new UserController();