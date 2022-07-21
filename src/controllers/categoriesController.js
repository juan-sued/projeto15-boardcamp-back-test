import connection from '../databases/postgres.js';

export default async function registerCategory(request, response) {
  const newCategory = request.body.name;

  const categories = response.locals.categories;

  const isRegistered = categories.some(category => category === newCategory);
  if (isRegistered) response.sendStatus(409);

  try {
    //adicionar categoria na tabela
  } catch {
    console.log('deu erro');
  }
}
