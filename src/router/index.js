import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/AuthStore';
import Home from '../components/Home.vue';
import Auth from '../components/Auth.vue';
import Register from '../components/Register.vue';
import CustomerList from '../components/CustomerList.vue';
import CustomerCreate from '../components/CustomerCreate.vue';
import MyCustomerList from '../components/MyCustomerList.vue';
import InvestmentList from "../components/InvestmentList.vue";
import InvestmentCreate from "../components/InvestmentsCreate.vue";
import StockList from "../components/StockList.vue";
import StockCreate from "../components/StockCreate.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/customer-list',
    name: 'CustomerList',
    component: CustomerList,
    meta: { requiresAuth: true }
  },
  {
    path: '/customer-list/:msg',
    name: 'CustomerUpdatedList',
    component: CustomerList,
    meta: { requiresAuth: true }
  },
  {
    path: '/customer-create',
    name: 'CustomerCreate',
    component: CustomerCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/customer-create/:pk',
    name: 'CustomerUpdate',
    component: CustomerCreate,
    meta: { requiresAuth: true }
  },
  {
    path: "/investment-list",
    name: "InvestmentList",
    component: InvestmentList,
    meta: { requiresAuth: true },
  },
  {
    path: "/investment-list/:msg",
    name: "InvestmentUpdatedList",
    component: InvestmentList,
    meta: { requiresAuth: true },
  },
  {
    path: "/investment-create",
    name: "InvestmentCreate",
    component: InvestmentCreate,
    meta: { requiresAuth: true },
  },
  {
    path: "/investment-create/:pk",
    name: "InvestmentUpdate",
    component: InvestmentCreate,
    meta: { requiresAuth: true },
  },
  {
    path: '/stock-list',
    name: 'StockList',
    component: StockList,
    meta: { requiresAuth: true }
  },
  {
    path: '/stock-list/:msg',
    name: 'StockUpdatedList',
    component: StockList,
    meta: { requiresAuth: true }
  },
  {
    path: '/stock-create',
    name: 'StockCreate',
    component: StockCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/stock-create/:pk',
    name: 'StockUpdate',
    component: StockCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/mycustomer-list',
    name: 'MyCustomerList',
    component: MyCustomerList
  },
  {
    path: '/mycustomer-list/:msg',
    name: 'MyCustomerUpdatedList',
    component: MyCustomerList
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Auth' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'Home' }
  }
  return true
})

export default router
