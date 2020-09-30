import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("customer", table => {
    table.increments("id").primary();

    table
      .integer("city_id")
      .notNullable()
      .references("id")
      .inTable("city")
      .onUpdate("cascade");

    table.integer("number").notNullable();
    
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("whatsapp").notNullable();
    table.string("cep").notNullable();
    table.string("street").notNullable();
    table.string("neighborhood").notNullable();
    table.string("complement").nullable();
    
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("customer");
}