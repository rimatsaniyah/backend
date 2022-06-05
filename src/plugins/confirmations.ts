import Hapi from '@hapi/hapi';
import { PrismaClient, Prisma } from '@prisma/client';
const confirmationsPlugin = {
  name: 'app/confirmations',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'POST',
        path: '/confirmation',
        options: {
          handler: createconfirmationHandler,
          description: 'Get todo',
          notes: 'Returns a todo item by the id passed in the path',
          tags: ['api'], // ADD THIS TAG
        },
      },
    ]),
      server.route([
        {
          method: 'GET',
          path: '/confirmations',
          options: {
            handler: getconfirmationsHandler,
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'], // ADD THIS TAG
          },
        },
      ]),
      server.route([
        {
          method: 'PUT',
          path: '/confirmation/{id}',
          options: {
            handler: updateconfirmationHandler,
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'], // ADD THIS TAG
          },
        },
      ]);
  },
};

export default confirmationsPlugin;
async function getconfirmationsHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  try {
    const transactions = await prisma.transaction.findMany({
      include: { sharer: true, product: true, confirmation: true },
    });
    return h.response(transactions).code(200);
  } catch (err) {
    console.log(err);
  }
}

async function createconfirmationHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {}
async function updateconfirmationHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {}