/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const hasData = await knex('product').select('id').limit(1);
  if (!hasData || hasData.length === 0) {
    await knex('product').insert([
      { product_name: 'Stone Island', description: 'puffer jacket', stock: 10, price: 7000000, id_category: 1, 'image_url' : 'https://res.cloudinary.com/datoj2i1q/image/upload/v1699884893/pp3cqbokvudw7fdmmyou.jpg' },
      { product_name: 'Iphone 13', description: 'Iphone baru 10/10', stock: 30, price: 12000000, id_category: 2 , 'image_url' : 'https://res.cloudinary.com/datoj2i1q/image/upload/f_auto,q_auto/q7kpzqoewhrka7bdllhg.png'},
      { product_name: 'Figurin Ace', description: 'figurine impor dari jepang', stock: 140, price: 2500000, id_category: 3 , 'image_url' : 'https://res.cloudinary.com/datoj2i1q/image/upload/v1699884864/azfacosfryajo5k7oy5p.jpg'}
    ]);
  }
};
