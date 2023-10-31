/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('merchant', (t)=>{
        t.increments('id').primary()
        t.string('shop_name').notNullable().unique()
        t.string('first_name').notNullable()
        t.string('last_name').notNullable()
        t.string('email').notNullable().unique()
        t.string('password').notNullable()
        t.string('shop_address').notNullable()
        t.text('shop_phone_number').notNullable()
        t.integer('id_category').unsigned().references('id').inTable('category').onUpdate('CASCADE').onDelete('CASCADE')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('merchant');
};
