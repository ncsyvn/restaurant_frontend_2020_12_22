import Vue from 'vue';
import Router, { Route } from 'vue-router';
import store from './store/store';
import { HTTP } from '@/HTTPServices';
import Login from './components/Login/Login.vue';
import Product from './components/Product/DanhSachSanPham.vue';
import Bill from './components/Bill/DanhSachPhieu.vue';
import Chart from './components/Home.vue';

Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        }, 
        {
            path: '/',
            name: 'chart',
            component: Chart
        },
        {
            path: '/product',
            name: 'product',
            component: Product
        },
        {
            path: '/bill/:type',
            name: 'bill',
            component: Bill
        },
    ],
});


function guardRoute(to: Route, from: Route, next: any): void {
    // work-around to get to the Vuex store (as of Vue 2.0)
    const isAuthenticated = store.state.user && store.state.user.AccessToken ? store.state.user.AccessToken.IsAuthenticated : false;
    if (!isAuthenticated) {
        next({
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        });
    } else {
        HTTP.get('/auth/validate-token/')
            .then(response => {
                next();
            })
            .catch(e => {
                store.commit('CLEAR_ALL_DATA');
                next({
                    path: '/login',
                    query: {
                        redirect: to.fullPath
                    }
                });
            });
    }
}