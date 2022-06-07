import Hapi from '@hapi/hapi';
import { PrismaClient, Prisma } from '@prisma/client';
const transactionsPlugin = {
  name: 'app/transactions',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'POST',
        path: '/transaction',
        options: {
          handler: createTransactionHandler,
          description: 'Get todo',
          notes: 'Returns a todo item by the id passed in the path',
          tags: ['api'], // ADD THIS TAG
        },
      },
    ]),
      server.route([
        {
          method: 'GET',
          path: '/transactions',
          options: {
            handler: getTransactionsHandler,
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'], // ADD THIS TAG
          },
        },
      ]),
      server.route([
        {
          method: 'PUT',
          path: '/transaction/{id}',
          options: {
            handler: updateTransactionHandler,
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'], // ADD THIS TAG
          },
        },
      ]);
  },
};

export default transactionsPlugin;
async function getTransactionsHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        sharer: true,
        product: true,
        confirmation: {
          include: { taker: true },
        },
      },
    });
    return h.response(transactions).code(200);
  } catch (err) {
    console.log(err);
  }
}

async function createTransactionHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const { productId, status, email } = request.payload as any;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    const transactions = await prisma.transaction.create({
      data: {
        productId,
        sharerId: user?.id,
        status,
      },
    });
    return h.response(transactions).code(200);
  } catch (err) {
    console.log(err);
  }
}
async function updateTransactionHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {}
