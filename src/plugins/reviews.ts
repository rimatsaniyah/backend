import Hapi from '@hapi/hapi';

const productsPlugin = {
  name: 'app/reviews',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/reviews',
        options: {
          handler: getAllReviewsHandler,
          description: 'Get todo',
          notes: 'Returns a todo item by the id passed in the path',
          tags: ['api'], // ADD THIS TAG
        },
      },
    ]);
  },
};

export default productsPlugin;

async function getAllReviewsHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  try {
    const reviews = await prisma.review.findMany();
    return h.response(reviews).code(200);
  } catch (err) {
    console.log(err);
  }
}
