(function() {

    "use strict";

    var domains = [];

    em.util.Token = {
        // type could be:
        //  fs or ms
        service : function (type, url) {
            var layer = L.esri.dynamicMapLayer(url, {
                opacity: 1,
                token:  response.token
            }).addTo(em.map);

            layer.on('authenticationrequired', function (e) {
                console.log('Retrieving token');
            });
        }
    };

})();
