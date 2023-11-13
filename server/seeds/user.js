/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const hasData = await knex('user').select('id').limit(1)
  if (!hasData || hasData.length === 0 ) {
    await knex('user').insert([
      { username: 'manusia', first_name: 'waldo', last_name: 'walerian', email: 'waldowalerian@gmail.com', password: '123456', address: 'jl. jendral sudirman no. 99', phone_number: '0821222345' },
      { username: 'manusia2', first_name: 'orang', last_name: 'A', email: 'orangA@gmail.com', password: '678755', address: 'jl. kebon kacang no. 93', phone_number: '0846562356' },
      { username: 'manusia3', first_name: 'orang', last_name: 'B', email: 'orangB@gmail.com', password: '656345', address: 'jl. pantai indah kapuk', phone_number: '0565878887' }
    ]);
  }
};
