import connection from '../databases/postgres.js';

export async function registerCustomer(request, response) {
  const newCustomer = request.body;
  try {
    await connection.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES
      ('${newCustomer.name}',
      '${newCustomer.phone}',
      '${newCustomer.cpf}',
      '${newCustomer.birthday}');`
    );
    return response.sendStatus(201);
  } catch {
    return response.status(500).send('erro ao inserir customers');
  }
}
export async function getCustomers(request, response) {
  const { cpf } = request.query;

  const queryBasic = `SELECT * FROM customers`;

  try {
    const query = !!cpf
      ? queryBasic + ` WHERE customers.cpf ILIKE '${cpf}%';`
      : queryBasic;

    const { rows: cpfs } = await connection.query(query);

    return response.status(200).send(cpfs);
  } catch {
    return response.sendStatus(500);
  }
}
