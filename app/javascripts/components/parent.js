(function() {
    var Parent = {
        controller: function () {
            var that = this;
    
            return this;
        },
    
        view: function (ctrl) {
            return [em.Menu];
        }
    };

    m.route.mode = 'hash';

    m.route(document.getElementById('app'), "/", {
        "/": Parent
    });

})();
