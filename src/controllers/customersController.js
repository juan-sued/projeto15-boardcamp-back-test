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
  const { id } = request.params;

  const queryBasic = `SELECT * FROM customers`;
  let query = queryBasic;
  try {
    if (!!cpf) {
      console.log('entrou e cpf é: ', cpf);
      query = queryBasic + ` WHERE customers.cpf ILIKE '${cpf}%';`;
    } else if (!!id) {
      console.log('entrou e id é: ', id);
      query = queryBasic + ` WHERE customers.id = '${id}';`;
    }
    console.log(query);
    const { rows: customer } = await connection.query(query);

    return response.status(200).send(customer);
  } catch {
    return response.sendStatus(500);
  }
}
