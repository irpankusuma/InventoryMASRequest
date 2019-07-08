import Vue from "vue";
import Vuex from "vuex";
import VueResource from "vue-resource";

const apps = "https://apps.alam-sutera.com/ASRILup/"; // APPS production
const report = "http://10.10.0.28/asrireport/Report/Common.aspx"; // SSRS development
const http = Vue.http;

Vue.use(VueResource);
Vue.use(Vuex);

export default http;
export const store = new Vuex.Store({
    state: {
        users: [],
        showMenu: true,
        userIDX: null,
        // serviceURL: url,
        appsURL: apps,
        reportURL: report,
        color: 'grey darken-3',
        bgcolor: 'grey lighten-5',
        fontcolor: 'black',
        userName: null,
        role: null,
        email: null
    },
    getters: {
        menuShow: state => {
            return (state.showMenu = true);
        },
        disableMenu: state => {
            return (state.showMenu = false);
        }
    },
    mutations: {
        checkSession: (state, data) => {
            if (data == "") {
                state.showMenu = false;
            } else {
                state.showMenu = true;
            }
        },
        getUsers: (state, data) => {
            for (var i in data) {
                state.userName = data[i].Name;
                state.role = data[i].RoleName;
                state.email = data[i].Email;
            }
        },
        toggle(state, data) {
            state.showMenu = data
        }
    },

    actions: {

    }
});