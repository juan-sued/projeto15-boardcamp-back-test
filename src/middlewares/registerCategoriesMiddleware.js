import connection from '../databases/postgres.js';
import registerCategorySchema from '../schemas/categorySchema.js';

async function validateNewCategory(request, response, next) {
  const newCategory = request.body;

  const validate = registerCategorySchema.validate(newCategory, { abortEarly: false });
  const { error } = validate;
  if (error) {
    const errors = error.details.map(err => err.message);
    return response.status(400).send(errors);
  }

  try {
    const { rows: categories } = await connection.query('SELECT * FROM categories');
    if (categories.length < 0) console.log('não tem categoria');

    response.locals.categories = categories;
    next();
  } catch {
    console.log('deu erro ao pegar categorias');
  }
}

export default validateNewCategory;
