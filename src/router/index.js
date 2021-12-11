import Vue from "vue";
import VueRouter from "vue-router";
import {authGuard} from "@/auth/auth_guard";

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: "/",
            name: "Home",
            component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue")
        },
        {
            path: '/profile',
            name: 'Profile',
            beforeEnter: authGuard,
            component: () => import(/* webpackChunkName: "Profile" */ "../views/Profile.vue")
        },
        {
            path: '/dash',
            name: 'Dash',
            component: () => import(/* webpackChunkName: "Login" */ "../views/Dash.vue")
        },
    ]
});