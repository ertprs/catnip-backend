import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("cart", table => {
    table.increments("id").primary();

    table
      .integer("customer_id")
      .notNullable()
      .references("id")
      .inTable("customer")
      .onUpdate("cascade");

    table
      .integer("address_id")
      .notNullable()
      .references("id")
      .inTable("customer_address")
      .onUpdate("cascade")
      .defaultTo(0);

    table.string("observation").nullable();

    table.decimal("total_quantity").notNullable();
    table.decimal("total_cost").notNullable();
    table.decimal("total_price").notNullable();
    table.decimal("total_discount").notNullable();
    table.decimal("total").notNullable();
    table.decimal("shipping").nullable();
    
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("cart");
}