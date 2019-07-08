//core
import Vue from "vue";
import Router from "vue-router";
import VueResource from 'vue-resource';
import CSHelpers from '../lib/helpers';

import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

// request and form
import FormRequest from "@/components/request/RequestForm";
import NewRequest from "@/components/request/NewRequest";
import EditRequest from "@/components/request/EditRequest";
import ViewRequest from "@/components/request/ViewRequest";

// my approve
import Approve from "@/components/approve/Approve";
import ViewApprove from "@/components/approve/ViewApprove";
import EditApprove from "@/components/approve/EditApprove";

// Stock
import LastStock from "@/components/stock/lastStock";

// Miscelanous
import PageNotFound from "@/components/notfound/PageNotFound";

Vue.use(Router);
Vue.use(VueResource);
Vue.use(CSHelpers, { name: 'aid' });

export default new Router({
    mode: "history",
    base: "/InventoryMASRequest",
    routes: [
        { path: "/", component: Login },
        { path: "/Login", component: Login },
        { path: "/dashboard", component: Dashboard },

        // request and form
        { path: "/myrequest", component: FormRequest },
        { path: "/newrequest", component: NewRequest },
        { path: "/editrequest/:id", component: EditRequest },
        { path: "/viewrequest/:id", component: ViewRequest },

        // my approve
        { path: "/myapprove", component: Approve },
        { path: "/viewapprove/:id", component: ViewApprove },
        { path: "/editapprove/:id", component: EditApprove },

        //stock
        { path: "/lastStock", component: LastStock },

        //not found and component
        { path: "*", component: PageNotFound },
    ]
});