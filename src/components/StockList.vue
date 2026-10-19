<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12">
        <blockquote>
          Welcome {{ validUserName }}!
          <footer>
            <small>
              <em>&mdash;Financial Services, your Midwest Financial Services Partner.</em>
            </small>
          </footer>
        </blockquote>
      </div>

      <div class="col-12 col-md-10 col-lg-10">
        <div v-if="showMsg === 'new'" class="alert alert-success">
          New Stock has been added.
        </div>
        <div v-else-if="showMsg === 'update'" class="alert alert-success">
          Stock information has been updated.
        </div>
        <div v-else-if="showMsg === 'deleted'" class="alert alert-success">
          Selected stock has been deleted.
        </div>
      </div>
    </div>

    <!-- Mobile view -->
    <div class="d-md-none" id="collapsable-stock-card" style="width: 80%">
      <button
        v-if="authenticated"
        type="button"
        class="btn btn-primary"
        @click="addNewStock"
      >
        <i class="bi bi-plus"></i>
      </button>

      <div class="card" v-for="stock in stocks" :key="stock.pk">
        <div class="card-header" :id="'heading' + stock.pk">
          <button
            class="btn btn-link collapsed"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + stock.pk"
            aria-expanded="false"
            :aria-controls="'collapse' + stock.pk"
          >
            <h6 style="color: #0275d8; float: left">{{ stock.symbol }}</h6>
          </button>
        </div>

        <div
          :id="'collapse' + stock.pk"
          class="collapse"
          :aria-labelledby="'heading' + stock.pk"
          data-bs-parent="#collapsable-stock-card"
        >
          <div class="card-body">
            <p><b>Customer:</b> {{ stock.customer }}</p>
            <p><b>Symbol:</b> {{ stock.symbol }}</p>
            <p><b>Stock Name:</b> {{ stock.name }}</p>
            <p><b>Number of Shares:</b> {{ stock.shares }}</p>
            <p><b>Purchase Price:</b> ${{ stock.purchase_price }}</p>
            <p><b>Purchase Date:</b> {{ stock.purchase_date }}</p>

            <div v-if="authenticated" class="btn-group">
              <button
                @click="updateStock(stock)"
                style="background-color: transparent; padding: 5px"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                @click="deleteStock(stock)"
                style="background-color: transparent; padding: 5px"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop view -->
    <div class="col col-12 col-md-10 d-none d-md-block">
      <table class="table table-hover" style="overflow-y: auto">
        <thead>
          <tr>
            <th>Customer #</th>
            <th>Symbol</th>
            <th>Stock Name</th>
            <th>Shares</th>
            <th>Purchase Price</th>
            <th>Purchase Date</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="stock in stocks" :key="stock.pk">
            <th>{{ stock.cust_number ?? stock.customer }}</th>
            <td>{{ stock.symbol }}</td>
            <td>{{ stock.name }}</td>
            <td>{{ stock.shares }}</td>
            <td>${{ stock.purchase_price }}</td>
            <td>{{ stock.purchase_date }}</td>

            <td>
              <button
                v-if="authenticated"
                @click="updateStock(stock)"
                style="background-color: transparent; padding: 0"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </td>

            <td>
              <button
                v-if="authenticated"
                @click="deleteStock(stock)"
                style="background-color: transparent; padding: 0"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <button
        v-if="authenticated"
        type="button"
        class="btn btn-primary"
        @click="addNewStock"
      >
        Add New Stock
      </button>
    </div>
  </div>
</template>

<script>
import router from '../router'
import { APIService } from '../api/APIService'
import { useAuthStore } from '@/store/AuthStore'

const apiService = new APIService()

export default {
  name: 'StockList',

  data: () => ({
    stocks: [],
    showMsg: '',
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
    },
  },

  mounted() {
    this.getStocks()
    this.showMessages()
  },

  methods: {
    showMessages() {
      if (this.$route.params.msg) {
        this.showMsg = this.$route.params.msg
      }
    },

    getStocks() {
      apiService
        .getStockList()
        .then((response) => {
          this.stocks = response.data.data
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.authStore.clearAuth()
            router.push('/auth')
          }
        })
    },

    addNewStock() {
      router.push('/stock-create')
    },

    updateStock(stock) {
      router.push('/stock-create/' + stock.pk)
    },

    deleteStock(stock) {
      if (confirm('Do you really want to delete this stock?')) {
        apiService
          .deleteStock(stock.pk)
          .then((response) => {
            if (response.status === 204) {
              router.push('/stock-list/deleted')
              this.getStocks()
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              this.authStore.clearAuth()
              router.push('/auth')
            }
          })
      }
    },
  },
}
</script>

<style>
button {
  padding: 1rem;
  border: 0;
  cursor: pointer;
}
</style>