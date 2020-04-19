import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childComps/Welcome')
const User = () => import('views/users/User')
const Rights = () => import('views/rights/Rights')
const Roles = () => import('views/roles/Roles')

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/home/welcome',
      children: [
        {
          path: '/home/welcome',
          component: Welcome
        },
        {
          path: '/home/users',
          component: User
        },
        {
          path: '/home/rights',
          component: Rights
        },
        {
          path: '/home/roles',
          component: Roles
        }
      ]
    }

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
});

export default router
