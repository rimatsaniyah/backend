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
    const transactions = await prisma.confirmation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: { taker: true },
    });
    return h.response(transactions).code(200);
  } catch (err) {
    console.log(err);
  }
}

async function createconfirmationHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const { productId, status, email, note } = request.payload as any;
  try {
    const product = await prisma.transaction.findUnique({
      where: { productId },
    });
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    const transactions = await prisma.confirmation.create({
      data: {
        transactionId: product?.id as any,
        takerId: user?.id,
        status,
        note,
      },
    });
    return h.response(transactions).code(200);
  } catch (err) {
    console.log(err);
  }
}
async function updateconfirmationHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const { id } = request.params as any;
  const { status } = request.payload as any;

  try {
    const updateUser = await prisma.confirmation.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    return h.response(updateUser).code(200);
  } catch (err) {
    console.log(err);
  }
}
