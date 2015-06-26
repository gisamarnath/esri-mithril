(function() {

    var Parent = {

        controller: function () {
            var that = this;
            var menu = null;
            var show = null;
            var hide = null;

            this.toggle_menu = function () {

                if (menu.className === 'menu-expanded') {
                    menu.className = 'menu-collapsed';
                    hide.className = 'menu-collapser hidden';
                    show.className = 'menu-collapser show';
                }
                else {
                    menu.className = 'menu-expanded';
                    hide.className = 'menu-collapser show';
                    show.className = 'menu-collapser hidden';
                }
            };

            this.domloaded = function (ele, isInit, ctx) {
                if (isInit) {
                    return;
                }

                menu = document.getElementById('menu');
                show = document.getElementById('menu-show');
                hide = document.getElementById('menu-hide');
            };

            return this;
        },
    
        view: function (ctrl) {
            return [
                m('#menu.menu-expanded', { config : ctrl.domloaded }, [ m.component(em.Menu, { collapse : ctrl.toggle_menu } ) ]),
                m('#menu-show', { onclick : ctrl.toggle_menu }, 
                    m('span', { class : 'glyphicon glyphicon-option-vertical' })
                )
            ];
        }
    };

    m.route.mode = 'hash';

    m.route(document.getElementById('app'), "/", {
        "/": Parent
    });

})();
