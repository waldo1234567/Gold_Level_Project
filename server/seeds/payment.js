/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const hasData = await knex('payment').select('id').limit(1)
  if (!hasData || hasData.length === 0) {
    await knex('payment').insert([
      { type: 'Transfer' },
      { type: 'Qris' },
      { type: 'Credit card' }
    ]);
  }

};
