import Knex from "knex";
import moment from "moment";

const now = moment().format("YYYY-MM-DD HH:mm:ss");

export async function seed(knex: Knex) {
  await knex("city").insert([
    { name: "Foz do Iguaçu", state_id: 1, ibge: "4108304", created_at: now, updated_at: now },
    { name: "Santa Terezinha de Itaipu", state_id: 1, ibge: "4124053", created_at: now, updated_at: now },
    { name: "Medianeira", state_id: 1, ibge: "4115804", created_at: now, updated_at: now },
    { name: "Matelândia", state_id: 1, ibge: "4115606", created_at: now, updated_at: now },
    { name: "São Miguel do Iguaçu", state_id: 1, ibge: "4125704", created_at: now, updated_at: now },
    { name: "Cascavel", state_id: 1, ibge: "4104808", created_at: now, updated_at: now },
    { name: "Curitiba", state_id: 1, ibge: "4106902", created_at: now, updated_at: now }
  ]);
}