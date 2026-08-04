<script setup>
import axios from '@axios'

const tableHeader = [
  {
    title: 'Order Id',
    key: 'orderId',
  },
  {
    title: 'Customer',
    key: 'customer',
  },
  {
    title: 'Product Name',
    key: 'productName',
  },
  {
    title: 'Amount',
    key: 'amount',
  },
  {
    title: 'Order Date',
    key: 'orderDate',
  },
  {
    title: 'Delivery Date',
    key: 'deliveryDate',
  },
  {
    title: 'Payment Method',
    key: 'paymentMethod',
  },
  {
    title: 'Delivery Status',
    key: 'deliveryStatus',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
]

const orders = ref([])

onMounted(() => {
  axios.get('/orders').then(response => {
    orders.value = response.data
  })
})

const searchOrder = ref('')

const productStatusColor = status => {
  if (status === 'Delivered')
    return 'success'
  if (status === 'Out for Delivery')
    return 'info'
  if (status === 'Shipped')
    return 'primary'
  if (status === 'Processing')
    return 'secondary'
  if (status === 'Pending')
    return 'warning'
  if (status === 'Cancelled')
    return 'error'
  
  return 'secondary'
}
</script>

<template>
  <VCard title="Orders">
    <template #append>
      <VTextField
        v-model="searchOrder"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search Order"
        style="min-inline-size: 11rem;"
      />
    </template>

    <VDataTable
      :headers="tableHeader"
      :search="searchOrder"
      :items="orders"
      :items-per-page="6"
      class="text-no-wrap rounded-0"
    >
      <template #item.orderId="{ item }">
        <span class="text-primary font-weight-semibold">
          #{{ item.orderId }}
        </span>
      </template>

      <template #item.customer="{ item }">
        <span class="font-weight-semibold">
          {{ item.customer }}
        </span>
      </template>

      <template #item.productName="{ item }">
        <span class="font-weight-semibold">
          {{ item.productName }}
        </span>
      </template>

      <template #item.amount="{ item }">
        <span class="font-weight-semibold">
          ${{ item.amount }}
        </span>
      </template>

      <template #item.deliveryStatus="{ item }">
        <VChip
          size="small"
          label
          :color="productStatusColor(item.deliveryStatus)"
        >
          {{ item.deliveryStatus }}
        </VChip>
      </template>

      <template #item.actions>
        <VBtn
          icon
          variant="text"
        >
          <VIcon icon="mdi-dots-vertical" />

          <VMenu activator="parent">
            <VList>
              <VListItem
                v-for="(item, index) in ['View', 'Delete', 'Edit']"
                :key="index"
                :value="index"
              >
                <VListItemTitle>{{ item }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn>
      </template>
    </VDataTable>
  </VCard>
</template>
