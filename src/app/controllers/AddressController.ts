import { Request, Response } from "express";
// import moment from "moment";
import moment from "moment";
import connection from "../../database/connection";

class AddressController {
  async store(request: Request, response: Response) {
    const {
      name,
      street,
      number,
      cep,
      neighborhood,
      complement
    } = request.body;

    const customer_id = request.customerId;

    const customer = await connection("customer").where("id", customer_id).first().select();

    if(!customer) return response.status(404).json({ error: "Customer not found", id: customer_id });

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    await connection("customer_address").insert({
      customer_id,
      name,
      street,
      number,
      cep,
      neighborhood,
      complement,
      created_at: now,
      updated_at: now
    });

    return response.sendStatus(201);
  }

  async index(request: Request, response: Response) {
    const address = await connection("customer_address").where("customer_id", request.customerId).select();

    return response.status(200).json(address);
  }

  async update(request: Request, response: Response) {
    const id = request.params.id;

    const address = request.body;

    const customer_id = request.customerId;

    const storedAddress = await connection("customer_address").where({ id }).select().first();

    if(!storedAddress) return response.status(404).json({ error: "Address not found", id });

    const customer = await connection("customer").where("id", customer_id).first().select();

    if(!customer) return response.status(404).json({ error: "Customer not found", id: customer_id });

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const updateAddress = {
      customer_id,
      number: address?.number,
      name: address?.name,
      cep: address?.cep,
      street: address?.street,
      neighborhood: address?.neighborhood,
      complement: address?.complement,
      updated_at: now
    }
    
    await connection("customer_address").update(updateAddress).where({ id });

    return response.sendStatus(200);
  }

  async delete(request: Request, response: Response) {
    const id = request.params.id;

    const address = await connection("customer_address").where({ id }).del();

    if(!address) return response.status(404).json({ error: "Address not found", id });

    return response.sendStatus(200);
  }
}

export default new AddressController();