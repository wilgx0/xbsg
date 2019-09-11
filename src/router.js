import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let base = `${process.env.BASE_URL}`; // 获取二级目录

export default new Router({
    //mode: 'history',
    base: base, // 设置 base 值
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./views/Home.vue'),
        },
        {
            path: '/program',     //山歌节目
            name: 'program',
            component: () => import('./views/Program.vue')
        },

        {
            path: '/song',     //山歌歌词
            name: 'song',
            component: () => import('./views/Song.vue')
        },
        {
            path: '/accompany',     //山歌伴奏
            name: 'accompany',
            component: () => import('./views/Accompany.vue')
        },
        {
            path: '/actor',     //演员剧照
            name: 'actor',
            component: () => import('./views/Actor.vue')
        },
        {
            path: '/messages',     //留言板
            name: 'messages',
            component: () => import('./views/Messages.vue')
        }
    ]
})
