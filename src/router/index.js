import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardView from "@/views/DashboardView";
import ListUserView from "@/views/ListUserView";
import ListUserPendingView from "@/views/ListUserPendingView";
import ListKoordinatorView from "@/views/ListKoordinatorView";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: DashboardView
    },
    {
        path: '/list_user',
        name: 'List User',
        component: ListUserView
    },
    {
        path: '/list_pending_user',
        name: 'List User - Pending',
        component: ListUserPendingView
    },
    {
        path: '/list_koordinator_user',
        name: 'List Koordinator',
        component: ListKoordinatorView
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
