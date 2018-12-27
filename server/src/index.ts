import {CryptowarsApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {CryptowarsApplication};

export async function main(options: ApplicationConfig = {}) {
    const app = new CryptowarsApplication({
        rest: {
            apiExplorer: {
                disabled: true,
            },
        }
    });
    await app.boot();
    await app.start();

    const url = app.restServer.url;
    console.log(`Server is running at ${url}`);
    console.log(`Try ${url}/ping`);

    return app;
}
