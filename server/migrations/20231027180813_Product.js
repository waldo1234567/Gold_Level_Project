/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('product', (t) => {
        t.increments('id').primary();
        t.string('product_name').notNullable();
        t.string('description');
        t.integer('stock').notNullable();
        t.integer('price').notNullable();
        t.integer('id_category').unsigned().references('id').inTable('category').onUpdate('CASCADE').onDelete('CASCADE'); 
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('product')
};
