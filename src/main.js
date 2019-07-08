require('../node_modules/vuetify/dist/vuetify.min.css');

import Vue from 'vue'
import App from './App'
import router from './router'
import CSHelpers from './lib/helpers'
import VueLocalStorage from 'vue-ls'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import { store } from './store/store'
import CsServiceMixin from './lib/mixin'
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(Vuetify, {
    theme: {
        primary: colors.pink.darken1,
        secondary: colors.grey.darken1,
        accent: colors.grey.darken2,
        error: colors.red.accent3
    }
})
Vue.use(VueQrcodeReader)
Vue.use(CSHelpers, { name: 'aid' })
Vue.use(require('vue-moment'))
Vue.use(VueLocalStorage, {
    namespace: 'IREMAS_',
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
})

// debug
Vue.config.silent = false;
Vue.config.devtools = true;
Vue.config.errorHandler = function(err, vm, info) {
    var errorH = [{
        'err': err,
        'vm': vm,
        'info': info
    }];
    Vue.aid.console(errorH, false);
};

Vue.filter('money',(number) => {
    if (number == undefined || number == null) number = 0;
        var parts = number.toString().split(".");
        return (
            parts[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") +
            (parts[1] ? "." + parts[1] : "")
        );
});

Vue.config.productionTip = false
    /* eslint-disable no-new */
new Vue({
    store: store,
    mixins: [CsServiceMixin],
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})