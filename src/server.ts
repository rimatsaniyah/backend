import Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';
import routes from './routes';
import users from './plugins/users';
import posts from './plugins/posts';
export let server: Server;
import prisma from './plugins/prisma';
export const init = async function (): Promise<Server> {
  server = Hapi.server({
    port: process.env.PORT || 4000,
    host: 'localhost',
  });
  await server.register([prisma, users, posts]);
  // Routes will go here
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
