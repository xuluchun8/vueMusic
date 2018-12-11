import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import Search from 'components/search/search'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'recommend',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      // name: 'recommend',
      component: Recommend
    },
    {
      path: '/rank',
      // name: 'rank',
      component: Rank
    },
    {
      path: '/singer',
      // name: 'singer',
      component: Singer
    },
    {
      path: '/search',
      // name: 'search',
      component: Search
    }
  ]
})
