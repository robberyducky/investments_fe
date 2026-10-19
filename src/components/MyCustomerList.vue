<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 align-items-center justify-content-center">
        <blockquote>
          Welcome {{ validUserName }}!
          <footer>
            <small>
              <em>&mdash;Financial Services, your Midwest Financial Services Partner.</em>
            </small>
          </footer>
        </blockquote>
      </div>

      <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
        <div class="alert alert-success" v-if="showMsg === 'new'" :value="true">
          New customer has been added.
        </div>
        <div class="alert alert-success" v-if="showMsg === 'update'" :value="true">
          Customer information has been updated.
        </div>
        <div class="alert alert-success" v-if="showMsg === 'deleted'" :value="true">
          Selected customer has been deleted.
        </div>
      </div>
    </div>

    <!-- Mobile device view -->
    <div class="d-md-none" id="collapsable-card" style="width: 80%">
      <button type="button" class="btn btn-primary" @click="addNewCustomer">
        <i class="bi bi-plus"></i>
      </button>
      <div class="card" v-for="customer in customers" :key="customer.pk">
        <div class="card-header" :id="'heading' + customer.cust_number">
          <button
            class="btn btn-link collapsed"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + customer.pk"
            aria-expanded="true"
            :aria-controls="'collapse' + customer.pk"
          >
            <h6 style="color: #0275d8; float: left">{{ customer.name }}</h6>
          </button>
        </div>

        <div
          :id="'collapse' + customer.pk"
          class="collapse"
          :aria-labelledby="'heading' + customer.pk"
          data-bs-parent="#collapsable-card"
        >
          <div class="card-body">
            <p><b>Name:</b> {{ customer.name }}</p>
            <p><b>Customer Number:</b> {{ customer.cust_number }}</p>
            <p>
              <b>Address:</b> {{ customer.address }}, {{ customer.city }},
              {{ customer.state }}, {{ customer.zipcode }}
            </p>
            <p><b>Email:</b> {{ customer.email }}</p>
            <p><b>Phone:</b> {{ customer.cell_phone }}</p>
            <p><b>Agent:</b> {{ customer.agent }}</p>

            <div v-if="canEditCustomer(customer)" class="btn-group">
              <button
                @click="updateCustomer(customer)"
                style="background-color: transparent; padding: 5px;"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                @click="deleteCustomer(customer)"
                style="background-color: transparent; padding: 5px;"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>

            <div v-else class="btn-group">
              <button style="background-color: transparent; padding: 5px;" disabled>
                <i class="bi bi-pencil"></i>
              </button>
              <button style="background-color: transparent; padding: 5px;" disabled>
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- non-Mobile device view -->
    <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-block">
      <table class="table table-hover" style="overflow-y: auto" :headers="headers">
        <thead>
          <tr>
            <th scope="col">Customer #</th>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">City</th>
            <th scope="col">State</th>
            <th scope="col">Zip Code</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Agent</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="customer in customers" :key="customer.pk">
            <th scope="row">{{ customer.cust_number }}</th>
            <td>{{ customer.name }}</td>
            <td>{{ customer.address }}</td>
            <td>{{ customer.city }}</td>
            <td>{{ customer.state }}</td>
            <td>{{ customer.zipcode }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.cell_phone }}</td>
            <td>{{ customer.agent }}</td>
            <td v-if="canEditCustomer(customer)" @click="updateCustomer(customer)">
              <button style="background-color: transparent; padding: 0;">
                <i class="bi bi-pencil"></i>
              </button>
            </td>
            <td v-else>
              <button style="background-color: transparent; padding: 0;" disabled>
                <i class="bi bi-pencil"></i>
              </button>
            </td>

            <td v-if="canEditCustomer(customer)" @click="deleteCustomer(customer)">
              <button style="background-color: transparent; padding: 5px;">
                <i class="bi bi-trash"></i>
              </button>
            </td>
            <td v-else>
              <button style="background-color: transparent; padding: 5px;" disabled>
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="authenticated">
        <button type="button" class="btn btn-primary" @click="addNewCustomer">
          Add New Customer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router'
import { APIService } from '../api/APIService'
import { useAuthStore } from '@/store/AuthStore'

const apiService = new APIService()

export default {
  name: 'MyCustomerList',

  data: () => ({
    customers: [],
    customerSize: 0,
    showMsg: '',
    isMobile: false,
    headers: [
      { text: 'Customer Number', sortable: false, align: 'left' },
      { text: 'Name', sortable: false, align: 'left' },
      { text: 'Address', sortable: false, align: 'left' },
      { text: 'City', sortable: false, align: 'left' },
      { text: 'State', sortable: false, align: 'left' },
      { text: 'ZipCode', sortable: false, align: 'left' },
      { text: 'Email', sortable: false, align: 'left' },
      { text: 'Phone', sortable: false, align: 'left' },
      { text: 'Agent', sortable: false, align: 'left' },
      { text: 'Update', sortable: false, align: 'left' },
      { text: 'Delete', sortable: false, align: 'left' }
    ],
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
    userID() {
      return Number(this.authStore.userID)
    },
    isSuperuser() {
      return this.authStore.is_superuser || this.authStore.is_superuser === 'true'
    }
  },

  mounted() {
    this.getMyCustomers()
    this.showMessages()
  },

  methods: {
    onResize() {
      this.isMobile = window.innerWidth <= 600
    },

    showMessages() {
      if (this.$route.params.msg) {
        this.showMsg = this.$route.params.msg
      }
    },

    canEditCustomer(customer) {
      return this.userID === customer.agent || this.isSuperuser
    },

    getMyCustomers() {
      apiService
        .getMyCustomerList()
        .then((response) => {
          this.customers = response.data.data
          this.customerSize = this.customers.length
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.authStore.clearAuth()
            router.push('/auth')
          }
        })
    },

    addNewCustomer() {
      if (this.authenticated) {
        router.push('/customer-create')
      } else {
        router.push('/auth')
      }
    },

    updateCustomer(customer) {
      router.push('/customer-create/' + customer.pk)
    },

    deleteCustomer(customer) {
      if (confirm('Do you really want to delete?')) {
        apiService
          .deleteCustomer(customer.pk)
          .then((response) => {
            if (response.status === 204) {
              router.push('/mycustomer-list/deleted/')
              this.getMyCustomers()
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              this.authStore.clearAuth()
              router.push('/auth')
            }
          })
      }
    }
  }
}
</script>

<style>
button {
  padding: 1rem;
  border: 0;
  cursor: pointer;
}
</style>
