import {CryptowarsApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {CryptowarsApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new CryptowarsApplication(options);
  options.rest = {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 86400,
      credentials: true,
    },
  };
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
