import Knex from "knex";
import moment from "moment";

const now = moment().format("YYYY-MM-DD HH:mm:ss");

export async function seed(knex: Knex) {
  await knex("state").insert([
    { name: "Paraná", uf: "PR", country: "BR", created_at: now, updated_at: now }
  ]);
}