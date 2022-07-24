import connection from '../databases/postgres.js';

export async function registerGame(request, response) {
  const newGame = request.body;

  try {
    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES
      ('${newGame.name}',
      '${newGame.image}',
      ${newGame.stockTotal},
      ${newGame.categoryId},
      ${newGame.pricePerDay})`
    );

    return response.sendStatus(201);
  } catch {
    return response.status(500).send('erro ao adicionar game');
  }
}

export async function getGames(request, response) {
  const { name } = request.query;

  const queryBasic = `SELECT games.*, categories.name AS categoryName FROM games JOIN categories ON categories.id = games."categoryId"`;

  try {
    const query = !!name
      ? queryBasic + ` WHERE games.name ILIKE '${name}%';`
      : queryBasic;

    const { rows: games } = await connection.query(query);

    return response.status(200).send(games);
  } catch {
    return response.sendStatus(500);
  }
}
