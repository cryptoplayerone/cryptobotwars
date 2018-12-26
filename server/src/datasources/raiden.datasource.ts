import {juggler} from '@loopback/service-proxy';
import {ExternalHosts} from '../constants';

const RaidenApi = `${ExternalHosts.raiden}/api/v1`;

export const RaidenDataSource: juggler.DataSource = new juggler.DataSource({
  name: 'Raiden',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: `${RaidenApi}/payments/{token}`,
        responsePath: '$',
      },
      functions: {
        payments: ['token'],
      },
    },
    {
      template: {
        method: 'POST',
        url: `${RaidenApi}/payments/{token}/{target}`,
        body: {
          amount: "{amount:number}",
          identifier: "{identifier:number}"
        },
        responsePath: '$',
      },
      functions: {
        pay: ['token', 'target', 'amount', 'identifier'],
      },
    },
  ],
});
