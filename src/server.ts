import Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';
import routes from './routes';
import users from './plugins/users';
import products from './plugins/products';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import categories from './plugins/categories';
import HapiSwagger from 'hapi-swagger';
export let server: Server;
import prisma from './plugins/prisma';
export const init = async function (): Promise<Server> {
  server = Hapi.server({
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
  });

  // Routes will go here
  const swaggerOptions = {
    info: {
      title: 'Test API Documentation',
    },
  };
  const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
    {
      plugin: Inert,
    },
    {
      plugin: Vision,
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ];
  await server.register(plugins);
  await server.register([prisma, users, products, categories]);
  server.route(routes);

  return server;
};

export const start = async function (): Promise<void> {
  console.log(
    `Listening on http://${server.settings.host}:${server.settings.port}`,
  );
  return server.start();
};

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection');
  console.error(err);
  process.exit(1);
});
