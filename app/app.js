import Vue from 'vue/dist/vue.js';
import Main from './pages/Main'

var app = new Vue({
    el: '#app',
    data: {
      eventBus: new Vue()
    },
    created: function() {
        console.log('Vue app created');
    },
    components: {
      'main-page': Main
    }
});
