import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("city", table => {
    table.increments("id").primary();

    table
      .integer("state_id")
      .notNullable()
      .references("id")
      .inTable("state")
      .onUpdate("cascade")
      .onDelete("cascade");
    
    table.integer("ibge").notNullable();

    table.string("name").notNullable();

    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();    
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("city");
}