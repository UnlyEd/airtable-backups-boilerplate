import { isHostedOnAws } from '@unly/utils-aws';
import moment from 'moment';

export const handler = async (event, context) => ({
  statusCode: 200,
  body: JSON.stringify({
    status: 'OK',
    environment: process.env.NODE_ENV,
    service: process.env.SERVICE,
    isHostedOnAws: isHostedOnAws(),
    processNodeEnv: process.env.NODE_ENV,
    time: moment().toISOString(),
    releasedAt: process.env.DEPLOY_TIME,
    version: process.env.npm_package_version,
    nodejs: process.version,
    EXAMPLE_ENV_VAR: process.env.EXAMPLE_ENV_VAR, // Example of ENV var defined in "/.env" file
    SERVICE: process.env.SERVICE, // Example of ENV var defined in "/serverless.yml"
  }),
});
