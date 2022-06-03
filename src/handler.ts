import { Request } from '@hapi/hapi';
const index = (request: Request): string => {
  console.log('Processing request', request.info.id);
  return 'Hello! Nice to have met you.';
};

export default index;
