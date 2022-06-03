import Hapi from '@hapi/hapi';

const productsPlugin = {
  name: 'app/categories',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/categories',
        options: {
          handler: getAllCategoriesHandler,
          description: 'Get todo',
          notes: 'Returns a todo item by the id passed in the path',
          tags: ['api'], // ADD THIS TAG
        },
      },
    ]);
  },
};

export default productsPlugin;

async function getAllCategoriesHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  try {
    const products = await prisma.category.findMany();
    return h.response(products).code(200);
  } catch (err) {
    console.log(err);
  }
}
