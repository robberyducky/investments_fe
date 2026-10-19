<template>
  <ul class="nav justify-content-end">
    <div class="FS">Financial Services</div>

    <li class="nav-item">
      <router-link to="/">Home</router-link> |
    </li>

    <li class="nav-item">
      <router-link :to="{ name: 'CustomerList' }">Customers</router-link> |
    </li>

    <li class="nav-item">
      <router-link :to="{ name: 'InvestmentList' }">Investments</router-link> |
    </li>

    <li class="nav-item">
      <router-link :to="{ name: 'StockList' }">Stocks</router-link> |
    </li>

    <li class="nav-item">
      <router-link :to="{ name: 'MyCustomerList' }">My Customers</router-link> |
    </li>

    <li class="nav-item" v-if="!authenticated">
      <router-link :to="{ name: 'Register' }">Register</router-link> |
    </li>

    <li class="nav-item" v-if="!authenticated">
      <router-link :to="{ name: 'Auth' }">Log in</router-link>
    </li>

    <li class="nav-item" v-if="authenticated">
      <a href="#" @click.prevent="logout">Logout</a>
    </li>
  </ul>

  <router-view />
</template>

<script>
import router from './router'
import { useAuthStore } from '@/store/AuthStore'

export default {
  name: 'App',

  computed: {
    authStore() {
      return useAuthStore()
    },
    authenticated() {
      return this.authStore.isAuthenticated
    }
  },

  methods: {
    logout() {
      this.authStore.clearAuth()
      router.push('/')
    },

    login() {
      router.push('/auth')
    },

    home() {
      router.push('/')
    },

    register() {
      router.push('/register')
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 1em;
  background-color: cadetblue;
  li {
    font-weight: bold;
    color: #2c3e50;
  }
  a {
    color: black;
    padding: 0.5em;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
  .FS {
    margin-right: 33em;
    font-weight: bold;
  }
}
</style>
