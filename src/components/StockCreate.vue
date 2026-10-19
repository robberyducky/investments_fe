<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col align-items-center">
        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
            <div
              class="alert alert-danger shadow"
              role="alert"
              v-if="showMsg === 'error'"
            >
              Please verify Stock Information
            </div>
          </div>
        </div>

        <div class="row align-items-center justify-content-center">
          <div
            class="col col-12 col-sm-10 col-md-10 col-lg-6 align-items-center"
          >
            <div class="card">
              <div class="card-header">{{ pageTitle }}</div>
              <div class="card-body">
                <form @submit.prevent="isUpdate ? updateStock() : createStock()">
                  <div class="container-fluid">
                    <div class="row justify-content-around py-2">
                      <label class="col-4">Customer</label>
                      <div class="col col-8">
                        <select
                          v-model="stock.customer"
                          class="form-select"
                          required
                        >
                          <option disabled value="">Select a customer</option>
                          <option
                            v-for="item in customers"
                            :key="item.pk"
                            :value="item.pk"
                          >
                            {{ item.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Symbol</label>
                      <div class="col col-8">
                        <input
                          v-model="stock.symbol"
                          type="text"
                          maxlength="10"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Stock Name</label>
                      <div class="col col-8">
                        <input
                          v-model="stock.name"
                          type="text"
                          maxlength="50"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Number of Shares</label>
                      <div class="col col-8">
                        <input
                          v-model="stock.shares"
                          type="number"
                          min="0.1"
                          step="0.1"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Purchase Price</label>
                      <div class="col col-8">
                        <input
                          v-model="stock.purchase_price"
                          type="number"
                          min="0"
                          step="0.01"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Purchase Date</label>
                      <div class="col col-8">
                        <input
                          v-model="stock.purchase_date"
                          type="date"
                          class="form-control"
                        />
                      </div>
                    </div>

                    <div class="row justify-content-around">
                      <button
                        type="submit"
                        class="btn btn-primary col-4"
                      >
                        {{ isUpdate ? 'Update' : 'Save' }}
                      </button>

                      <button
                        type="button"
                        class="btn btn-secondary col-4"
                        @click="cancelOperation"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import { APIService } from "../api/APIService";

const apiService = new APIService();

export default {
  name: "StockCreate",

  data() {
    return {
      customers: [],
      stock: {
        customer: "",
        symbol: "",
        name: "",
        shares: "",
        purchase_price: "",
        purchase_date: "",
      },
      pageTitle: "Add New Stock",
      isUpdate: false,
      showMsg: "",
    };
  },

  methods: {
    getCustomers() {
      apiService
        .getCustomerList()
        .then((response) => {
          this.customers = response.data.data;
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            router.push("/auth");
          } else {
            this.showMsg = "error";
          }
        });
    },

    createStock() {
      apiService
        .addNewStock(this.stock)
        .then((response) => {
          if (response.status === 201) {
            router.push("/stock-list/new");
          } else {
            this.showMsg = "error";
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            router.push("/auth");
          } else {
            this.showMsg = "error";
          }
        });
    },

    updateStock() {
      apiService
        .updateStock(this.stock)
        .then((response) => {
          if (response.status === 200) {
            router.push("/stock-list/update");
          } else {
            this.showMsg = "error";
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            router.push("/auth");
          } else {
            this.showMsg = "error";
          }
        });
    },

    cancelOperation() {
      router.push("/stock-list");
    },
  },

  mounted() {
    this.getCustomers();

    if (this.$route.params.pk) {
      this.pageTitle = "Edit Stock";
      this.isUpdate = true;

      apiService
        .getStock(this.$route.params.pk)
        .then((response) => {
          this.stock = response.data;
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            router.push("/auth");
          } else {
            this.showMsg = "error";
          }
        });
    }
  },
};
</script>