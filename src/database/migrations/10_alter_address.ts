import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.alterTable("customer_address", table => {
    table.string("name").notNullable().defaultTo("");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("customer_address");
}