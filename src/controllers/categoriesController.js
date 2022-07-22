import connection from '../databases/postgres.js';

export default async function registerCategory(request, response) {
  console.log('problema aqui');
  const newCategory = request.body.name;
  try {
    await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [newCategory]);

    return response.sendStatus(201);
  } catch {
    return response.sendStatus(500);
  }
}
