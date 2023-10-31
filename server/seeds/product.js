/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const hasData = await knex('product').select('id').limit(1);
  if (!hasData || hasData.length === 0) {
    await knex('product').insert([
      { product_name: 'Stone Island', description: 'puffer jacket', stock: 10, price: 7000000, id_category: 1 },
      { product_name: 'Iphone 13', description: 'Iphone baru 10/10', stock: 30, price: 12000000, id_category: 2 },
      { product_name: 'Figurin Ace', description: 'figurine impor dari jepang', stock: 140, price: 2500000, id_category: 3 }
    ]);
  }
};
