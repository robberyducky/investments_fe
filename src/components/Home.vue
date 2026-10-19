<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col col-12 align-items-center justify-content-center">
        <blockquote>
          &#8220;Welcome {{ validUserName }}!&#8221;
          <footer>
            <small>
              <em>&mdash;Financial Services, your Midwest Financial Services Partner.</em>
            </small>
          </footer>
        </blockquote>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 col-sm-10 col-md-10">
        <div class="card-group">
          <div class="card">
            <img :src="customerImg" class="card-img-top" style="height: 15rem">
            <div class="card-body">
              <h5 class="card-title">Customers</h5>
              <a @click="viewCustomers" class="btn btn-primary">Show Customers</a>
            </div>
          </div>
          <div class="card">
            <img
              :src="investmentImg"
              class="card-img-top"
              style="height: 15rem"/>
            <div class="card-body">
              <h5 class="card-title">Investments</h5>
              <a @click="viewInvestments" class="btn btn-primary">Show Investments</a>
            </div>
          </div>
          <div class="card">
            <img
              src="https://placehold.co/600x300?text=Stocks"
              class="card-img-top"
              style="height: 15rem"
              alt="Stocks"
            />
            <div class="card-body">
              <h5 class="card-title">Stocks</h5>
              <a @click="viewStocks" class="btn btn-primary">Show Stocks</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router';
import { APIService } from '../api/APIService';
import { useAuthStore } from '@/store/AuthStore';
import customerImg from '@/assets/customer.jpg';
import investmentImg from "@/assets/nonstock.jpg";

const apiService = new APIService()

export default {
  name: 'Home',

  data: () => ({
    customerImg: customerImg,
    investmentImg: investmentImg,
    showMsg: '',
    user: null
  }),

  computed: {
    authStore() {
      return useAuthStore()
    },
    authenticated() {
      return this.authStore.isAuthenticated
    },
    validUserName() {
      return this.authStore.user || 'Guest'
    }
  },

  mounted() {
    if (this.authenticated) {
      this.getUserInfo()
    }
  },

  methods: {
    getUserInfo() {
      apiService
        .getUser()
        .then((response) => {
          this.user = response.data
        })
        .catch((error) => {
          if (error.message === 'Network Error') {
            this.showMsg = 'axiosError'
          } else {
            this.showMsg = 'axiosError'
            this.authStore.clearAuth()
            router.push('/auth')
          }
        })
    },

    viewCustomers() {
      router.push('/customer-list')
    },

    viewInvestments() {
      router.push('/investment-list');
    },

        viewStocks() {
      router.push('/stock-list');
    },
  }
}
</script>

<style></style>
