import { Request, Response } from "express";
import moment from "moment";
import bcrypt from "bcryptjs";

import connection from "../../database/connection";

class CustomerController {
  async store(request: Request, response: Response) {
    const auth = request.headers.authorization;
    
    if(auth != process.env.AUTH_TOKEN) return response.sendStatus(401);

    const {
      city_id,
      name,
      email,
      password,
      whatsapp,
      cep,
      street,
      number,
      neighborhood,
      complement
    } = request.body;
    
    const cityExists = await connection("city").where("id", city_id).select("id").first();

    if(!cityExists) return response.status(404).json({ error: "City not found", city: city_id });

    const customerExists = await connection("customer").where({ email }).select("email").first();

    if(customerExists) return response.status(409).json({ error: "E-mail already exists", email });

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = {
      city_id,
      name,
      email,
      password: hashedPassword,
      whatsapp,
      cep,
      street,
      number,
      neighborhood,
      complement,
      created_at: now,
      updated_at: now
    };

    const insertedIds = await connection("customer").insert(customer);
    const id = insertedIds[0];

    const city = await connection("city")
      .where("city.id", city_id)
      .join("state", "city.state_id", "state.id")
      .select("city.name", "state.uf")
      .first();

    return response.status(201).json({ 
      id, 
      name, 
      email, 
      whatsapp,
      cep,
      street, 
      number, 
      neighborhood, 
      complement,
      city: city.name, 
      uf: city.uf, 
      created_at: customer.created_at, 
      updated_at: customer.updated_at 
    });
  }

  async show(request: Request, response: Response) {
    const customer = await connection("customer")
      .where("customer.id", request.customerId)
      .join("city", "customer.city_id", "city.id")
      .join("state", "city.state_id", "state.id")
      .select(
        "customer.id",
        "customer.name",
        "customer.email",
        "customer.whatsapp",
        "customer.cep",
        "customer.street",
        "customer.number",
        "customer.neighborhood",
        "customer.complement",
        "city.name as city",
        "state.uf",
        "customer.created_at",
        "customer.updated_at"
      )
      .first();

    return response.status(200).json(customer);
  }

  async update(request: Request, response: Response) {
    const {
      city_id,
      name,
      email,
      password,
      whatsapp,
      cep,
      street,
      number,
      neighborhood,
      complement
    } = request.body;

    const cityExists = await connection("city").where("id", city_id).select("id").first();

    if(!cityExists) return response.status(404).json({ error: "City not found", city: city_id });

    const customerExists = await connection("customer").where("id", request.customerId).select("id").first();

    if(!customerExists) return response.status(404).json({ error: "Customer not found", id: request.customerId });

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = {
      city_id,
      name,
      email,
      password: hashedPassword,
      whatsapp,
      cep,
      street,
      number,
      neighborhood,
      complement,
      updated_at: now
    };

    await connection("customer").where("id", request.customerId).update(customer);

    const city = await connection("city")
      .where("city.id", city_id)
      .join("state", "city.state_id", "state.id")
      .select("city.name", "state.uf")
      .first();

    return response.status(201).json({ 
      id: request.customerId, 
      name, 
      email, 
      whatsapp,
      cep,
      street, 
      number, 
      neighborhood, 
      complement,
      city: city.name, 
      uf: city.uf,
      updated_at: customer.updated_at 
    });
  }

  async delete(request: Request, response: Response) {
    const customer = await connection("customer").where("id", request.customerId).del();

    if(!customer) return response.status(404).json({ error: "Customer not found", id: request.customerId });

    return response.sendStatus(200);
  }
}

export default new CustomerController;