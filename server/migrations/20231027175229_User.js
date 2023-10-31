/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user', (t)=>{
        t.increments('id').primary()
        t.string('username').notNullable().unique()
        t.string('first_name').notNullable()
        t.string('last_name').notNullable()
        t.string('email').notNullable().unique()
        t.string('password').notNullable()
        t.string('address').notNullable()
        t.text('phone_number')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user')
};
