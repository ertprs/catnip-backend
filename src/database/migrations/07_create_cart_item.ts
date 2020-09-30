import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("cart_item", table => {
    table.increments("id").primary();
    
    table
      .integer("cart_id")
      .notNullable()
      .references("id")
      .inTable("cart")
      .onUpdate("cascade")
      .onDelete("cascade");

    table
      .integer("product_id")
      .notNullable()
      .references("id")
      .inTable("product")
      .onUpdate("cascade");

    table.decimal("quantity").notNullable();
    table.decimal("cost").notNullable();
    table.decimal("price").notNullable();
    table.decimal("discount").nullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("cart_item");
}