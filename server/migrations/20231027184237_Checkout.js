/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('checkout', (t)=>{
        t.increments('id').primary()
        t.timestamp('created_at')
        t.string('order_status')
        t.integer('id_user').unsigned().references('id').inTable('user').onUpdate('CASCADE').onDelete('CASCADE')
        t.integer('id_payment').unsigned().references('id').inTable('payment').onUpdate('CASCADE').onDelete('CASCADE')
        t.integer('total')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('checkout')
};
