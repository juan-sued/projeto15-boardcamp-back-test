import connection from '../databases/postgres.js';
import dayjs from 'dayjs';
export async function registerRental(request, response) {
  const NewRental = request.body;
  const { gameSelected } = response.locals;
  const daysRentedCount = NewRental.daysRented * gameSelected[0].pricePerDay;
  const today = dayjs().format('YYYY-MM-DD');
  try {
    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES
      (${NewRental.customerId},
      ${NewRental.gameId},
      '${today}',
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

export async function returnRental(request, response) {
  const { id } = request.params;
  const { rentalSelected } = response.locals;

  const rentDateResume = rentalSelected[0].rentDate;

  const today = dayjs().format('YYYY-MM-DD');
  console.log(today);
  console.log(rentDateResume);
  const countDelayFee = dayjs(rentDateResume).diff(today, 'd');

  try {
    await connection.query(
      `UPDATE rentals SET returnDate = '${dayjs().format(
        'YYYY-MM-DD'
      )}', delayFee = '${countDelayFee}' WHERE rentals.id = ${id};`
    );

    return response.sendStatus(201);
  } catch {
    return response.status(500).send('erro ao adicionar rental no banco');
  }
}
