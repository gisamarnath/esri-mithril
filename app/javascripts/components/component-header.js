(function () {
    
    em.ComponentHeader = {
        controller: function (args) {
            var that = this;
    
            return this;
        },
    
        view: function (ctrl, args, extras) {
            return m('div', [
                m('button.btn.btn-default', 
                    { onclick : args.back }, 
                    m('span', { class : 'glyphicon glyphicon-chevron-left' }))
            ]);
        }
    };

})();
