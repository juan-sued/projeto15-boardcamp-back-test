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
