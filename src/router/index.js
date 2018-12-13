import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import Search from 'components/search/search'
import SingerDetail from 'components/singerDetail/singerDetail'

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
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      // name: 'search',
      component: Search
    }
  ]
})
