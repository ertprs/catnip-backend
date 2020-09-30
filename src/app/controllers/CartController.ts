import { Request, Response } from "express";
import moment from "moment";
import connection from "../../database/connection";

interface CartItemData {
  product_id: number;
  quantity: number;
  cost: number;
  price: number;
  discount: number;
}

interface CartData {
  customer_id: number;
  address_id: number;
  observation: string;
  shipping: number;
  items: CartItemData[];
}

class CartController {
  async store(request: Request, response: Response) {
    const {
      customer_id,
      address_id,
      observation,
      shipping,
      items
    } = request.body as CartData;

    const itemsNotFound: number[] = [];

    for(const item of items) {
      const storedItem = await connection("product").where("id", item.product_id).select().first();

      if(!storedItem) {
        itemsNotFound.push(item.product_id);
      }
    }

    if(itemsNotFound.length > 0) return response.status(404).json({ error: "Products not found", id: itemsNotFound });

    let itemsIds: number[] = [];
    let total_quantity: number = 0;
    let total_cost: number = 0;
    let total_price: number = 0;
    let total_shipping: number = 0;
    let total_discount: number = 0;

    if(shipping) total_shipping = shipping;

    items.map((item: CartItemData) => {
      itemsIds.push(item.product_id);

      total_quantity += item.quantity;
      total_cost += item.cost;
      total_price += item.price;

      if(item.discount) total_discount += item.discount;
    });

    const total = (total_price + total_shipping) - total_discount;

    const productQuantity = await connection("product").whereIn("id", itemsIds).select("quantity");

    let notQuantityItems: number[] = [];

    for(let i = 0; i < items.length; i++) {
      if(items[i].quantity > productQuantity[i].quantity) {
        notQuantityItems.push(items[i].product_id);
      }
    }

    if(notQuantityItems.length > 0) return response.status(400).json({ error: "Insufficient quantity in stock", id: notQuantityItems });

    const trx = await connection.transaction();

    try {
      const now = moment().format("YYYY-MM-DD HH:mm:ss");

      const insertedCartIds = await trx("cart").insert({
        customer_id,
        address_id,
        observation,
        total_quantity,
        total_cost,
        total_price,
        total_discount,
        shipping,
        total,
        created_at: now,
        updated_at: now
      });

      const cart_id = insertedCartIds[0];

      for(const item of items) {
        await trx("cart_item").insert({
          cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          cost: item.cost,
          price: item.price,
          discount: item.discount
        });

        await trx("product").where("id", item.product_id).decrement("quantity", item.quantity);
      }

      await trx.commit();

      return response.status(201).json({ id: cart_id });
    } catch {
      await trx.rollback();

      return response.status(500).json({ error: "Unexpected error" });
    }
  }

  async index(request: Request, response: Response) {
    const storedCarts = await connection("cart")
      .where("customer_id", request.customerId)
      .select();

    let cart: object[] = [];

    for(const carts of storedCarts) {
      const storedItems = await connection("cart_item").where("cart_id", carts.id);

      let cartItems: CartItemData[] = [];

      for(const item of storedItems) {
        cartItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          cost: item.cost,
          price: item.price,
          discount: item.discount
        });
      }

      cart.push({
        id: carts.id,
        customer_id: carts.customer_id,
        observation: carts.observation,
        total_quantity: carts.total_quantity,
        total_cost: carts.total_cost,
        total_price: carts.total_price,
        total_discount: carts.total_discount,
        shipping: carts.shipping,
        total: carts.total,
        created_at: carts.created_at,
        updated_at: carts.updated_at,
        items: cartItems
      });
    }

    return response.status(200).json(cart);
  }

  async show(request: Request, response: Response) {
    const id = request.params.id;

    const storedCarts = await connection("cart_item")
      .where("cart_item.cart_id", id)
      .where("cart.customer_id", request.customerId)
      .join("cart", "cart_item.cart_id", "cart.id")
      .select();

    if(storedCarts.length <= 0) return response.status(404).json({ error: "Order with this customer not found", cart: id, customer: request.customerId });

    let cartItems: CartItemData[] = [];

    for(const storedCart of storedCarts) {
      cartItems.push({
        product_id: storedCart.product_id,
        quantity: storedCart.quantity,
        cost: storedCart.cost,
        price: storedCart.price,
        discount: storedCart.discount
      });
    }

    const carts = storedCarts[0];

    const cart = {
      id: carts.id,
      customer_id: carts.customer_id,
      observation: carts.observation,
      total_quantity: carts.total_quantity,
      total_cost: carts.total_cost,
      total_price: carts.total_price,
      total_discount: carts.total_discount,
      shipping: carts.shipping,
      total: carts.total,
      created_at: carts.created_at,
      updated_at: carts.updated_at,
      items: cartItems
    };

    return response.status(200).json(cart);
  }

  async delete(request: Request, response: Response) {
    const id = request.params.id;

    const trx = await connection.transaction();

    try {
      const cart = await trx("cart").where({ id }).where("customer_id", request.customerId).del();

      if(cart === 0) {
        await trx.rollback();

        return response.json({ error: "Order not found", id });
      }

      await trx("cart_item").where("cart_id", id).del();

      trx.commit();

      return response.sendStatus(200);
    } catch {
      trx.rollback();

      return response.sendStatus(500);
    }
  }
}

export default new CartController;