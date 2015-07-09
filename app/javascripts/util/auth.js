(function() {

    "use strict";

    /**
     * Currently active ArcGIS auth tokens
     * @type {Object}
     */
    var activeTokens = {};

    /**
     * queue of token requests
     * @type {Array}
     */
    var queue = [];

    /**
     * Popup config object pulled from main.js
     * @type {Object}
     */
    var popupConfig = em.config.popup;

    /**
     * Service object for managing secured layers
     * @type {Object}
     */
    em.auth = {

        init : function (config, callback) {
            var domain = em.util.getDomainFromUrl(config.loginUrl);
            var active = activeTokens[domain];

            if (active && active.expires && active.expires > Date.now()) {
                callback(active.token);
                return;
            }

            em.auth.showPopup(domain);

            var handle = subscribe('popup.save', function (username, password) {
                unsubscribe(handle);

                if (!username || !password) {
                    console.log('popup.save returned poorly', arguments);
                    return;
                }

                L.esri.post(config.loginUrl, {
                    username: username,
                    password: password,
                    f: 'json',
                    expiration: 86400,
                    client: 'referer',
                    referer: window.location.origin
                }, function (e, response) {
                    
                    if (!response || !response.token) {
                        // try again
                        console.log('token was bad', response);
                        em.config.popup.warning('Invalid credentials. Try again.');
                        return;
                    }

                    em.component.Popup.hide();

                    activeTokens[domain] = { expires : response.expires, token : response.token };

                    callback(response.token);
                });
            });
        },

        showPopup : function (domain) {
            popupConfig.title('Authentication Required');
            popupConfig.tag('Please login: ' + domain);

            em.component.Popup.show();
        },

        addHandler : function (layer) {
            layer.on('authenticationrequired', function (e) {
                console.log(arguments);
            });
        }
    };
})();
