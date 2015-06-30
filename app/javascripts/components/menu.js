(function() {

    "use strict";

    em.component.Menu = {
        controller: function (args) {
            var that = this;
            this.component = m.prop('default');

            this.loadComponent = function (e) {
                that.component(e.target.getAttribute('data-component'));
            };

            this.back = function () {
                that.component('default');
            };

            return this;
        },

        view: function (ctrl, args, extras) {
            var top;

            switch (ctrl.component()) {
                case 'basemaps' : top = m.component(em.component.Basemaps, { back : ctrl.back }); break;
                case 'layers' : top = m.component(em.component.Layers, { back : ctrl.back }); break;
                case 'tools' : top = m.component(em.component.Tools, { back : ctrl.back }); break;
                default :
                    top = [];
                    top.push(m.component(em.ComponentHeader, { title : 'Menu' }));
                    top.push(m('div', [
                        m('ul', {class : 'nav nav-pills nav-stacked' }, [
                            m('li', m('a', { 'data-component': 'basemaps', onclick: ctrl.loadComponent }, 'Basemaps' ) ),
                            m('li', m('a', { 'data-component': 'layers', onclick: ctrl.loadComponent }, 'Layers' ) ),
                            m('li', m('a', { 'data-component': 'tools', onclick: ctrl.loadComponent }, 'Tools' ) ),
                        ])
                    ]));
                    break;
            }

            return m('div', [
                m('div#menu-container', top),
                m('#menu-hide.menu-collapser', { onclick : args.collapse }, 
                    m('span', { class : 'glyphicon glyphicon-option-vertical' })
                )
            ]);
        }
    };

})();
