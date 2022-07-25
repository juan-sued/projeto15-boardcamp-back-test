import connection from '../databases/postgres.js';

async function validateReturnRental(request, response, next) {
  const { id } = request.params;
  const query = `SELECT * FROM rentals WHERE rentals.id = ${id};`;
  try {
    const { rows: rentalSelected } = await connection.query(query);

    if (rentalSelected.length === 0) return response.sendStatus(404);
    response.locals.rentalSelected = rentalSelected;
    next();
  } catch {
    response.status(500).send('erro ao validar return');
  }
}

export default validateReturnRental;
