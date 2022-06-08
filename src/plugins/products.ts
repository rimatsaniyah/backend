import Hapi from '@hapi/hapi';
import { PrismaClient, Prisma } from '@prisma/client';
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import stream from 'stream';
const productsPlugin = {
  name: 'app/products',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/products',
        options: {
          handler: getAllProductsHandler,
          description: 'Get todo',
          notes: 'Returns a todo item by the id passed in the path',
          tags: ['api'], // ADD THIS TAG
        },
      },
    ]);
    server.route([
      {
        method: 'POST',
        path: '/product',
        options: {
          handler: createProductHandler,
          description: 'Get todo',
          notes: 'Returns a todo item by the id passed in the path',
          tags: ['api'], // ADD THIS TAG
          payload: {
            parse: true,
            allow: 'multipart/form-data',
            multipart: { output: 'stream' },
          },
        },
      },
    ]);
  },
};

export default productsPlugin;

async function getAllProductsHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        transaction: true,
        review: { include: { user: true } },
      },
    });
    return h.response(products).code(200);
  } catch (err) {
    console.log(err);
  }
}
async function createProductHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  type Product = {
    name: string;
    description: string;
    location: string;
    avatar: string;
    files: {
      pipe: (arg0: any) => any;
      on: (arg0: any, arr: (args1: any) => any) => any;
      _data: any;
      hapi: {
        filename: string;
        headers: any;
      };
    };
  };
  const { prisma } = request.server.app;
  const payload: Product = request.payload as Product;
  console.log(payload);
  const name = payload?.name;
  const storage = new Storage();
  const filename = payload?.files.hapi?.filename;
  const headers = payload?.files.hapi?.headers;

  const bucketName = 'stuffy-f8d96.appspot.com';
  const myBucket = storage.bucket(bucketName);
  const file = myBucket.file(filename);
  const passthroughStream = new stream.PassThrough();
  passthroughStream.write(payload.files._data);
  passthroughStream.end();

  async function streamFileUpload() {
    passthroughStream.pipe(file.createWriteStream()).on('finish', () => {
      // The file upload is complete
      async function makePublic() {
        await storage.bucket(bucketName).file(filename).makePublic();

        console.log(`gs://${bucketName}/${filename} is now public.`);
      }

      makePublic().catch(console.error);
    });

    console.log(`${filename} uploaded to ${bucketName}`);
  }

  streamFileUpload().catch(console.error);

  const description = payload?.description;

  const avatar = await storage.bucket(bucketName).file(filename).publicUrl();
  const location = payload?.location;
  try {
    const productData: Prisma.ProductCreateInput[] = [
      {
        name: name,
        location: location,
        description: description,
        avatar: avatar,
      },
    ];
    for (const u of productData) {
      const products = await prisma.product.create({
        data: u,
      });
      return h.response(products).code(200);
    }
  } catch (err) {
    console.log(err);
  }
}
