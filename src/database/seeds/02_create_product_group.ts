import Knex from "knex";
import moment from "moment";

const now = moment().format("YYYY-MM-DD HH:mm:ss");

export async function seed(knex: Knex) {
  await knex("product_group").insert([
    { name: "Acessórios", description: "Acessórios diversos", created_at: now, updated_at: now },
    { name: "Camisetas", description: "Camisetas diversas", created_at: now, updated_at: now },
    { name: "Camisas", description: "Camisas diversas", created_at: now, updated_at: now },
    { name: "Saias", description: "Saias diversas", created_at: now, updated_at: now },
    { name: "Shorts", description: "Shorts diversos", created_at: now, updated_at: now },
    { name: "Calças", description: "Calças diversas", created_at: now, updated_at: now },
    { name: "Vestidos", description: "Vestidos diversos", created_at: now, updated_at: now }
  ]);
}