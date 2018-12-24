import {juggler} from '@loopback/service-proxy';
import {ExternalHosts} from '../constants';

const VaderHost = ExternalHosts.vader;
const YodaHost = ExternalHosts.yoda;

export const RobotDataSource: juggler.DataSource = new juggler.DataSource({
  name: 'Robot',
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
        url: `${VaderHost}/vader/connect`,
      },
      functions: {
        vader_connect: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${VaderHost}/vader/stop`,
      },
      functions: {
        vader_stop: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${VaderHost}/vader/pres`,
      },
      functions: {
        vader_pres: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${VaderHost}/vader/wins`,
      },
      functions: {
        vader_wins: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${VaderHost}/vader/loses`,
      },
      functions: {
        vader_loses: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${VaderHost}/vader/stage`,
      },
      functions: {
        vader_stage: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${VaderHost}/vader/rock`,
      },
      functions: {
        vader_rock: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${VaderHost}/vader/paper`,
      },
      functions: {
        vader_paper: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${VaderHost}/vader/scissors`,
      },
      functions: {
        vader_scissors: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/connect`,
      },
      functions: {
        yoda_connect: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/stop`,
      },
      functions: {
        yoda_stop: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/pres`,
      },
      functions: {
        yoda_pres: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/wins`,
      },
      functions: {
        yoda_wins: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/loses`,
      },
      functions: {
        yoda_loses: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/stage`,
      },
      functions: {
        yoda_stage: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/rock`,
      },
      functions: {
        yoda_rock: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/paper`,
      },
      functions: {
        yoda_paper: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: `${YodaHost}/yoda/scissors`,
      },
      functions: {
        yoda_scissors: [],
      },
    },
  ],
});
