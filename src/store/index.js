import Vue from 'vue';
import Vuex from 'vuex';
import * as userStore from '@/store/module/userStore'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        userStore
    }
})
