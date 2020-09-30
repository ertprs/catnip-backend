import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("user", table => {
    table.increments("id").primary();

    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();

    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();    
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("user");
}