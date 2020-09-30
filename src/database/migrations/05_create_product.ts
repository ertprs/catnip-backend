import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("product", table => {
    table.increments("id").primary();

    table
      .integer("group_id")
      .notNullable()
      .references("id")
      .inTable("product_group")
      .onUpdate("cascade");

    table.string("name").notNullable();
    table.string("description").nullable();
    table.string("size", 3).notNullable();
    table.string("measures").nullable();

    table.decimal("quantity").notNullable();
    table.decimal("cost").notNullable();
    table.decimal("price").notNullable();
    
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("product");
}