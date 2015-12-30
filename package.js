Package.describe({
  summary: "Accounts service for Dink accounts"
});

Npm.depends({
    "html-to-text": "1.3.1",
    'csv': "0.4.6"
});

Package.on_use(function(api) {	

  /*****************************************************************************/
  /* Api Uses */
  /*****************************************************************************/

  api.use([
    'base64', 
    'underscore',
    'mongo',
    'peerlibrary:fs'
    ], ['server'])

  api.use([
    'templating', 
    ], ['client'])

  api.use([
    'accounts-base', 
    'accounts-oauth',
    'oauth2',
    'oauth',
    'service-configuration',
    'http'
    ], ['client', 'server'])

  /*****************************************************************************/
  /* Files */
  /*****************************************************************************/

  // Client
  api.add_files('client/js/battlenet_client.js', 'client');

  // Server
  api.add_files([
    'server/battlenet_server.js',
    ], 'server');

  // Both
  api.add_files("battlenet.js");

  /*****************************************************************************/
  /* Assets */
  /*****************************************************************************/

  api.addAssets([
  ], ['client', 'server']);

});