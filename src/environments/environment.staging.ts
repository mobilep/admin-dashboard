// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  apiEndpoint: 'https://api.mobilepractice.io/api/v1',
  apiEndpointV4: 'https://api.mobilepractice.io/api/v4',
  firebase: {
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    databaseURL: 'https://mobile.firebaseio.com'
  },
  s3: {
    assetUrl: 'https://s3-eu-west-1.amazonaws.com/mobile'
  }
};
