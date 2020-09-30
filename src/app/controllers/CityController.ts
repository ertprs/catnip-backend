import { Request, Response } from "express";

import connection from "../../database/connection";

class CityController {
  async index(request: Request, response: Response) {
    const cities = await connection("city").distinct().select();

    return response.status(200).json(cities);    
  }

  async show(request: Request, response: Response) {
    const id = request.params.id;

    const city = await connection("city")
      .where("city.id", id)
      .join("state", "city.state_id", "state.id")
      .select("city.name", "state.uf")
      .first();

    return response.status(200).json(city);
  }
};

export default new CityController();