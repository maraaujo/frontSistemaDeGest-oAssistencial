<script setup>
import axios from '@axios'

const orderStatistics = [
  {
    icon: 'mdi-noodles',
    status: 'Preparing',
    amount: '61.94',
    order: 1,
    color: 'warning',
  },
  {
    icon: 'mdi-truck-fast-outline',
    status: 'On Road',
    amount: '209.88',
    order: 2,
    color: 'info',
  },
  {
    icon: 'mdi-close-circle-outline',
    status: 'Cancelled',
    amount: '12.99',
    order: 1,
    color: 'error',
  },
  {
    icon: 'mdi-check-circle-outline',
    status: 'Delivered',
    amount: '61.94',
    order: 1,
    color: 'success',
  },
]

const orders = ref([])

const statusColor = {
  'On Road': 'primary',
  'Preparing': 'warning',
  'Cancelled': 'error',
  'Delivered': 'success',
}

const headers = [
  {
    title: 'Order Number',
    value: 'id',
  },
  {
    title: 'Customer',
    value: 'customerName',
  },
  {
    title: 'Total',
    value: 'total',
  },
  {
    title: 'Date & Time',
    value: 'dateTime',
  },
  {
    title: 'Status',
    value: 'status',
  },
]

const search = ref('')
const statusF = ref()
const paymentMethod = ref()

const fetchOrders = async () => {
  try {
    const res = await axios.get('/restaurant/orders', {
      params: {
        q: search.value,
        status: statusF.value,
        payMethod: paymentMethod.value,
      },
    })

    orders.value = res.data.orders
  } catch (error) {
    console.error(error)
  }
}

watch([
  search,
  statusF,
  paymentMethod,
], fetchOrders, { immediate: true })
</script>

<template>
  <div>
    <VRow>
      <VCol
        v-for="item in orderStatistics"
        :key="item.status"
        cols="12"
        md="3"
        sm="6"
      >
        <VCard class="text-center">
          <VCardText>
            <VIcon
              size="48"
              :color="item.color"
              :icon="item.icon"
            />

            <h6 class="text-base font-weight-medium mt-3 mb-1">
              {{ item.status }}
            </h6>
            <h6 class="text-h5 mb-1">
              ${{ item.amount }}
            </h6>
            <p class="text-medium-emphasis mb-0">
              From {{ item.order }} Orders
            </p>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard title="Orders">
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                sm="4"
              >
                <VTextField
                  v-model="search"
                  label="Search"
                />
              </VCol>

              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="statusF"
                  label="Status"
                  :items="['On Road', 'Cancelled', 'Preparing', 'Delivered']"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="paymentMethod"
                  label="Payment Method"
                  :items="['Cash', 'Debit Card', 'Credit Card']"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VDataTable
            :headers="headers"
            :items="orders"
            class="text-no-wrap rounded-t-0"
          >
            <template #item.id="{ item }">
              <strong class="text-primary">#{{ item.id }}</strong>
            </template>

            <template #item.customerName="{ item }">
              <h6 class="text-sm">
                {{ item.customerName }}
              </h6>
              <span class="text-medium-emphasis">{{ item.customerEmail }}</span>
            </template>

            <template #item.total="{ item }">
              <span>${{ item.total }}</span>
            </template>

            <template #item.status="{ item }">
              <VChip
                :color="statusColor[item.status]"
                size="small"
              >
                {{ item.status }}
              </VChip>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
