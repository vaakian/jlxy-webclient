import Study from '@/components/Study';
import Interact from '@/components/Interact.vue';
import Mall from '@/components/Mall';
import Setting from '@/components/Setting';

const routes = [
    {
      path: '/',
      name: 'study',
      component: Study,
      meta: {
        index: 1,
        title: '学习'
      }
    },
    {
      path: '/interact',
      name: 'interact',
      component: Interact,
      meta: {
        index: 2,
        title: '互动'
      }
    },
    {
      path: '/mall',
      name: 'mall',
      component: Mall,
      meta: {
        index: 3,
        title: '商城'
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,
      meta: {
        index: 4,
        title: '设置'
      }
    }
  ]

export default routes;