import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("customer_address", table => {
    table.increments("id").primary();

    table
      .integer("customer_id")
      .notNullable()
      .references("id")
      .inTable("customer")
      .onUpdate("cascade")
      .onDelete("cascade");

    table.integer("number").notNullable();
    
    table.string("cep").notNullable();
    table.string("street").notNullable();
    table.string("neighborhood").notNullable();
    table.string("complement").nullable();
    
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("customer_address");
}