(function () {
    
    em.ComponentHeader = {
        controller: function (args) {
            var that = this;
    
            return this;
        },
    
        view: function (ctrl, args, extras) {
            return m('div.bg-primary.clearfix', [
                !args.back ? null : 
                    m('button.close', 
                        { onclick : args.back, 'aria-label' : 'Close', type : 'button' }, 
                        m('span.h1', { 'aria-hidden' : 'true' }, m.trust('&times;'))
                    ),
                m('h4', args.title || '')
            ]);
        }
    };

})();
