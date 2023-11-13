/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  const hasData = await knex('category').select('id').limit(1)
  if( !hasData || hasData.length === 0 ){
    await knex('category').insert([
      {category_name: 'apparel'},
      {category_name: 'electronics'},
      {category_name: 'toys'},
      {category_name: 'animals'},
      {category_name: 'furniture'},
      {category_name: 'utilities'}
    ]);
  }
  
};
