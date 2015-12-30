Battlenet = {};

// Request SurveyMonkey credentials for the user
// @param options {optional} XXX support options.requestPermissions
// @param credentialRequestCompleteCallback {Function} Callback function to call on
// completion. Takes one argument, credentialToken on success, or Error on
// error.

Battlenet.requestCredential = function (options, credentialRequestCompleteCallback) {

  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'battlenet'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();
  var scope = (config && config.scope) || [];
  var flatScope = _.map(scope, encodeURIComponent).join(" ");
  var loginStyle = OAuth._loginStyle('battlenet', config, options);
  var region = options && options.region ? options.region : "eu";


  // url to app, enters "step 1" as described in
  // packages/accounts-oauth1-helper/oauth1_server.js
  var url = 'https://' + region +'.battle.net/oauth/authorize'
    + '?client_id=' + config.clientId
    + '&state=' + OAuth._stateParam(loginStyle, credentialToken)
    + "&scope=" + flatScope
    + '&response_type=code'
    + '&redirect_uri=' + config.redirectUri;//OAuth._redirectUri("Battlenet", config); 


  console.log("wtf", {
    loginService: "battlenet",
    loginStyle: loginStyle,
    loginUrl: url,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {
      width: 800,
      height: 800
    }
  });

  OAuth.launchLogin({
    loginService: "battlenet",
    loginStyle: loginStyle,
    loginUrl: url,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {
      width: 800,
      height: 800
    }
  });

};

// Create login function

Meteor.loginWithBattlenet = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Battlenet.requestCredential(options, credentialRequestCompleteCallback);

  };
  





