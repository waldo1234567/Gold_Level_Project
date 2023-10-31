/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('merchant').del()
  await knex('merchant').insert([
    {shop_name: 'toko baju acong', first_name: 'Acong', last_name: 'Jaya', email: 'acongjaya@gmail.com', password: 'jayajayajaya', shop_address: 'PIK avenue lantai 3', shop_phone_number: '0098773445', id_category: 1},
    {shop_name: 'toko hape asim', first_name: 'Asim', last_name: 'Asem', email: 'matahari@gmail.com', password: 'sinarterang', shop_address: 'Mangga Dua Square lantai 5', shop_phone_number: '0121445477', id_category: 2},
  ]);
};
