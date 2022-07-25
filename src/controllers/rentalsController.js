import connection from '../databases/postgres.js';
import dayjs from 'dayjs';
export async function registerRental(request, response) {
  const NewRental = request.body;
  const { gameSelected } = response.locals;
  const daysRentedCount = NewRental.daysRented * gameSelected[0].pricePerDay;
  try {
    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES
      (${NewRental.customerId},
      ${NewRental.gameId},
      '${dayjs().format('YYYY-MM-DD')}',
      ${daysRentedCount},
      ${null},
      ${gameSelected[0].pricePerDay},
      ${null}
      );`
    );

    return response.sendStatus(201);
  } catch {
    return response.status(500).send('erro ao adicionar rental no banco');
  }
}

export async function getRentals(request, response) {
  const { customerId } = request.query;
  const { gameId } = request.query;

  const queryBasic = `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", categories.name AS "categoryName", categories.id AS "categoryId" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;`;
  let query = queryBasic;

  try {
    if (!!customerId) {
      query = queryBasic + ` WHERE customers.id = '${customerId}';`;
    } else if (!!gameId) {
      query = queryBasic + ` WHERE games.id = '${gameId}';`;
    }

    const { rows: rentals } = await connection.query(query);

    const rentalsJoin = [];

    for (let rental of rentals) {
      rentalsJoin.push({
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: {
          id: rental.customerId,
          name: rental.customerName
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName
        }
      });
    }

    if (!rentals) return response.sendStatus(404);

    return response.status(200).send(rentalsJoin);
  } catch {
    return response.status(500).send('erro ao pegar alugueis');
  }
}
