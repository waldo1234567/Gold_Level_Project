/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('checkoutItems', (t) => {
        t.increments('id').primary();
        t.integer('checkout_id').unsigned().references('id').inTable('checkout').onUpdate('CASCADE').onDelete('CASCADE')
        t.integer('product_id').unsigned().references('id').inTable('product').onUpdate('CASCADE').onDelete('CASCADE')
        t.integer('quantity').notNullable();
        t.decimal('price', 10, 2).notNullable();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('checkoutItems');
};
