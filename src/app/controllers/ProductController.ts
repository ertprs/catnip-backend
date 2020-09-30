import { Request, Response } from "express";
import moment from "moment";

import connection from "../../database/connection";

class ProductController {
  async store(request: Request, response: Response) {
    const {
      group_id,
      name,
      description,
      size,
      measures,
      cost,
      price,
      quantity,
      url
    } = request.body;

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const product = {
      group_id,
      name,
      description,
      size,
      measures,
      cost,
      price,
      quantity,
      url,
      created_at: now,
      updated_at: now
    };

    const insertedIds = await connection("product").insert(product);
    const id = insertedIds[0];

    const product_group = await connection("product_group")
      .where("id", group_id)
      .select("name")
      .first();

    return response.status(201).json({
      id,
      name,
      description,
      size,
      measures,
      group: product_group.name,
      cost,
      price,
      quantity,
      url,
      created_at: product.created_at,
      updated_at: product.updated_at
    });
  }

  async index(request: Request, response: Response) {
    const products = await connection("product").distinct().select();

    return response.status(200).json(products);
  }

  async show(request: Request, response: Response) {
    const id = request.params.id;
    
    const product = await connection("product").where({ id }).select().first();

    if(!product) return response.status(404).json({ error: "Product not found", id });

    return response.status(200).json(product);
  }

  async update(request: Request, response: Response) {
    const id = request.params.id;

    const {
      group_id,
      name,
      description,
      size,
      measures,
      cost,
      price,
      quantity,
      url
    } = request.body;

    const productExists = await connection("product").where({ id }).select("id").first();

    if(!productExists) return response.status(404).json({ error: "Product not found", id });

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const product = {
      group_id,
      name,
      description,
      size,
      measures,
      cost,
      price,
      quantity,
      url,
      updated_at: now
    };

    await connection("product").where({ id }).update(product);

    const product_group = await connection("product_group")
      .where("id", group_id)
      .select("name")
      .first();

    return response.status(201).json({
      id,
      name,
      description,
      size,
      measures,
      group: product_group.name,
      cost,
      price,
      quantity,
      url,
      updated_at: product.updated_at
    });    
  }

  async patch(request: Request, response: Response) {
    const id = request.params.id;

    const body = request.body;

    const productExists = await connection("product").where({ id }).select("id").first();

    if(!productExists) return response.status(404).json({ error: "Product not found", id });

    const now = moment().format("YYYY-MM-DD HH:mm:ss");

    const updateProduct = {
      group_id: body.group_id && body.group_id,
      name: body.name && body.name,
      description: body.description && body.description,
      size: body.size && body.size,
      measures: body.measures && body.measures,
      cost: body.cost && body.cost,
      price: body.price && body.price,
      quantity: body.quantity && body.quantity,
      url: body.url && body.url,
      updated_at: now
    };

    await connection("product").where({ id }).update(updateProduct);

    const product = await connection("product")
      .where("product.id", id)
      .join("product_group", "product.group_id", "product_group.id")
      .select(
        "product_group.name as group", 
        "product.name as product", 
        "product.description", 
        "product.size",
        "product.measures",
        "product.cost",
        "product.price",
        "product.quantity",
        "product.url"
      )
      .first();

    return response.status(201).json({
      id,
      name: product.product,
      description: product.description,
      size: product.size,
      measures: product.measures,
      group: product.group,
      cost: product.cost,
      price: product.price,
      quantity: product.quantity,
      url: product.url,
      updated_at: updateProduct.updated_at
    });       
  }

  async delete(request: Request, response: Response) {
    const id = request.params.id;

    const product = await connection("product").where({ id }).del();

    if(!product) return response.status(404).json({ error: "Product not found", id });

    return response.sendStatus(200);
  }
}

export default new ProductController();