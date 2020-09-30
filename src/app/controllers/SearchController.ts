import { Request, Response } from "express";

import axios from "axios";

class SearchController {
  async search(request: Request, response: Response) {
    const { cep } = request.body;

    try {
      const searchedAddress = await axios.get(`https://api.pagar.me/1/zipcodes/${cep}`);

      if(searchedAddress) {
        const searchedAddressData = searchedAddress.data;

        const address = {
          cep: searchedAddressData.zipcode,
          state: searchedAddressData.state,
          city: searchedAddressData.city,
          neighborhood: searchedAddressData.neighborhood,
          street: searchedAddressData.street          
        };

        return response.status(200).json(address);
      }
    } catch {
      return response.sendStatus(500);
    }
  }
};

export default new SearchController();