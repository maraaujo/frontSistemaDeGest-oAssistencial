import { defineStore } from 'pinia'
import axios from '@axios'

export const useInvoiceStore = defineStore('InvoiceStore', {
  actions: {
    fetchInvoices() {
      return axios.get('/invoices')
    },
    fetchInvoice(invoiceId) {
      return axios.get('/invoice', { params: { invoiceId } })
    },
    deleteInvoice(invoiceId) {
      return axios.get('/invoice/delete', { params: { invoiceId } })
    },
  },
})
