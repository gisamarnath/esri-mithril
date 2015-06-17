(function() {

    em.Menu = {
        controller: function () {
            var that = this;
            var menu = null;

            this.expand = function () {
                if (menu === null)
                    menu = document.getElementById('menu');
                
                document.getElementById('menu-click').setAttribute('style', 'display: none;');
                menu.className = 'menu-expanded';
            };

            return this;
        },

        view: function (ctrl) {
            return m('div', [
                m('#menu'), 
                m('#menu-click', { onclick : ctrl.expand }, 
                    m('span', { class : 'glyphicon glyphicon-menu-right' })
                )
            ]);
        }
    };

})();
