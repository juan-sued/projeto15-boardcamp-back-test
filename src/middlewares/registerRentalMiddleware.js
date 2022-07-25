import connection from '../databases/postgres.js';
import rentalSchema from '../schemas/rentalSchema.js';

async function validateNewRental(request, response, next) {
  const newRental = request.body;

  const validate = rentalSchema.validate(newRental, { abortEarly: false });
  const { error } = validate;

  if (error) {
    const errors = error.details.map(err => err.message);
    return response.status(400).send(errors);
  }

  try {
    const { rows: isCustomerRegistered } = await connection.query(
      `SELECT * FROM customers WHERE customers.id = ${newRental.customerId}`
    );

    if (!isCustomerRegistered) return response.sendStatus(400);

    //============================================================
    const { rows: gameSelected } = await connection.query(
      `SELECT * FROM games WHERE games.id = ${newRental.gameId};`
    );

    if (!gameSelected) return response.sendStatus(400);

    const { rows: rentals } = await connection.query(
      `SELECT * FROM rentals WHERE rentals."gameId" = $1`,
      [gameId]
    );
    if (rentals.length >= gameSelected[0].stockTotal) response.sendStatus(400);

    response.locals.gameSelected = gameSelected;

    next();
  } catch {
    response.send('erro ao validar rentals');
  }
}

export default validateNewRental;
