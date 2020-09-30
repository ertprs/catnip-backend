import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.alterTable("product", table => {
    table.string("url").nullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("product");
}