/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('cartItems', (t)=>{
        t.increments('id').primary()
        t.integer('quantity')
        t.integer('id_product').unsigned().references('id').inTable('product').onUpdate('CASCADE').onDelete('CASCADE')
        t.integer('id_cart').unsigned().references('id').inTable('cart').onUpdate('CASCADE').onDelete('CASCADE')
        t.timestamp('created_at');
    })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('cartItems');
};
