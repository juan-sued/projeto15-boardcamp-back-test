import connection from '../databases/postgres.js';
import customerSchema from '../schemas/customerSchema.js';

async function validateAttCustomer(request, response, next) {
  const newCustomer = request.body;
  const { id } = request.params;

  const validate = customerSchema.validate(newCustomer, { abortEarly: false });
  const { error } = validate;

  if (error) {
    const errors = error.details.map(err => err.message);
    return response.status(400).send(errors);
  }

  try {
    const { rows: customers } = await connection.query(
      `SELECT * FROM customers WHERE customers.id != ${id}`
    );

    const isCpfRegistered = customers.some(customer => customer.cpf === newCustomer.cpf);

    if (isCpfRegistered) return response.sendStatus(409);

    next();
  } catch {
    response.status(500).send('erro ao pegar categorias');
  }
}

export default validateAttCustomer;
