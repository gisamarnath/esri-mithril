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

    function shiftQueue() {
        queue.shift();

        if (queue.length <= 0) {
            return;
        }

        var req = queue[0];
        getToken(req.config, req.callback);
    }

    function getToken(config, callback) {
        var domain = em.util.getDomainFromUrl(config.loginUrl);

        var token = em.auth.getToken(domain);

        if (token !== null) {
            callback(token);
            shiftQueue();
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

                em.auth.setToken(domain, response.token, response.expires);

                callback(response.token);

                shiftQueue();
            });
        });
    }

    /**
     * Service object for managing secured layers
     * @type {Object}
     */
    em.auth = {

        init : function (config, callback) {
            queue.push({ config : config, callback : callback });

            if (queue.length > 1) {
                return;
            }

            var req = queue[0];
            getToken(req.config, req.callback);
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
        },

        setToken : function (domain, token, expires) {
            activeTokens[domain] = { expires : expires, token : token };

            window.localStorage.setItem(domain + 'token', token);
            window.localStorage.setItem(domain + 'expires', expires);
        },

        getToken : function (domain) {
            var active = activeTokens[domain];

            if (active && active.expires && active.expires > Date.now()) {
                return active.token;
            }

            var token = localStorage.getItem(domain + 'token');
            var expires = localStorage.getItem(domain + 'expires');

            if (token === null || expires === null || expires <= Date.now()) {
                return null;
            }

            console.log('found token in storage', domain);

            activeTokens[domain] = { 
                expires : expires, 
                token : token 
            };

            return token;
        }
    };
})();
