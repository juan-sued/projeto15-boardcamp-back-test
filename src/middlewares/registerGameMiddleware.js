import connection from '../databases/postgres.js';
import gameSchema from '../schemas/gameSchema.js';

async function validateNewGame(request, response, next) {
  const newGame = request.body;

  const validate = gameSchema.validate(newGame, { abortEarly: false });
  const { error } = validate;

  if (error) {
    const errors = error.details.map(err => err.message);
    return response.status(400).send(errors);
  }

  try {
    const { rows: games } = await connection.query('SELECT * FROM games');

    const isNameRegistered = games.some(game => game.name === newGame.name);

    if (isNameRegistered) return response.sendStatus(409);

    //============================================================

    const categories = await connection.query(`SELECT * FROM categories WHERE id = $1`, [
      newGame.categoryId
    ]);

    if (categories.rowCount === 0)
      return response.status(400).send('não existe categoria com esse id');

    next();
  } catch {
    response.send('erro ao pegar categorias');
  }
}

export default validateNewGame;
