// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  debug: true,
  production: false,
  apiServerUrl: 'https://devapi.ctemplar.com/',
  onionDomain: 'ctemplar42u6fulx.onion',
  onionApiServerUrl: 'http://api.ctemplar42u6fulx.onion/',
  webSocketUrl: 'wss://devapi.ctemplar.com/connect/',
  webSocketOnionUrl: 'wss://devapi.ctemplar.com/connect/',
};
