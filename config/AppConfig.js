import { Constants } from 'expo';

const ENV = {
  dev: {
    apiUrl: 'https://dev.api.stgsolution.com',
    providerId: 20,
    versionSuffix: ' dev',
  },
  prod: {
    apiUrl: 'https://api.stgsolution.com',
    providerId: 20,
    versionSuffix: '',
  },
};

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return ENV.dev;
  if (env.indexOf('dev') !== -1) return ENV.dev;
  if (env.indexOf('prod') !== -1) return ENV.prod;
  return ENV.dev;
}

const AppConfig = getEnvVars(Constants.manifest.releaseChannel);
export default AppConfig;
