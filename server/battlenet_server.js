var Future = Npm.require('fibers/future');
var htmlToText = Npm.require('html-to-text');


//
// Registering the service
//
Oauth.registerService('battlenet', 2, null, function(query) {

    var accessToken = Battlenet.getAccessToken(query);
    var identity = Battlenet.getIdentity(accessToken);

    console.log("id ", query);
    return {
        serviceData: {
            id: identity.id,
            accessToken: OAuth.sealSecret(accessToken),
        },
        options: {
            profile: {
                name: identity.battletag, 
                battleTag: identity.battletag
            }
        }
    };
});

//
// Battlenet object
//
Battlenet = {};
Meteor.Battlenet = Battlenet;

/**
  * @desc   Retrieves the credential linked to a credentialToken.
  * @param  credentialToken
  * @param  credentialSecret
  * @return The credential
*/

Battlenet.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};


/**
  * @desc   Get the accessToken linked to a code and some other info (depends on Battlenet).
  * @param  Parsed query with code as param
  * @return The accessToken and userId
*/

Battlenet.getAccessToken = function(query) {

    var response;
    var config = ServiceConfiguration.configurations.findOne({ service: "battlenet"});

    try {
        response = HTTP.post(
            'https://eu.battle.net/oauth/token', {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    client_secret: Meteor.settings.battlenet.client_secret,
                    code: query.code,
                    redirect_uri: config.redirectUri,
                    client_id: config.clientId,
                    grant_type: "authorization_code"
                }
            });
    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with Battlenet. 1" + err.message), {
            response: err.response
        });
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error("Failed to complete OAuth handshake with Battlenet. 2" + response.data.error);
    } else {
        return response.data.access_token;
    }

};

/**
  * @desc   Get the identity linked to an accessToken.
  * @param  {String} Parsed query with code as param
  * @return {object} identity of the user
*/

Battlenet.getIdentity = function(accessToken) {

    var response;
    var config = ServiceConfiguration.configurations.findOne({ service: "battlenet"});

    try {
        response = HTTP.get(
            'https://eu.api.battle.net/account/user?access_token=' + accessToken, {
                headers: {
                    Accept: 'application/json'
                },
                params: {
                }
            });
    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with Battlenet. " + err.message), {
            response: err.response
        });
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error("Failed to complete OAuth handshake with Battlenet. " + response.data.error);
    } else {
        return response.data;
    }

};




