<script setup>
import AddEditMenuDialog from '@/components/AddEditMenuDialog.vue'
import axios from '@axios'

const menus = ref([])
const page = ref(1)
const rowPerPage = ref(6)
const search = ref('')
const filter = ref('')
const isAddDialogVisible = ref(false)
const menu = ref()

const fetchMenus = async () => {
  try {
    const res = await axios.get('/restaurant/menu', { params: { filter: filter.value } })

    menus.value = res.data.menus
  } catch (error) {
    console.error(error)
  }
}

watch(filter, fetchMenus, { immediate: true })

const editMenu = data => {
  menu.value = data
  isAddDialogVisible.value = true
}

const addMenu = () => {
  menu.value = {
    desc: '',
    img: '',
    name: '',
    price: 0,
    tax: 0,
    type: '',
  }
  isAddDialogVisible.value = true
}
</script>

<template>
  <div>
    <VCard
      title="Menu"
      variant="outlined"
    >
      <template #append>
        <VBtn
          color="primary"
          @click="addMenu"
        >
          Add New Menu
        </VBtn>
      </template>

      <VCardText class="d-flex align-center flex-wrap gap-4">
        <div>
          <VTextField
            v-model="search"
            label="Search Menu"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search menu..."
            style="inline-size: 13rem;"
          />
        </div>

        <VSpacer />

        <VBtnToggle
          v-model="filter"
          divided
          color="primary"
          density="compact"
          variant="outlined"
          class="overflow-x-auto"
        >
          <VBtn value="Appetizer">
            Appetizer
          </VBtn>
          <VBtn value="Salad">
            Salad
          </VBtn>
          <VBtn value="Main Course">
            Main Course
          </VBtn>
          <VBtn value="Dessert">
            Dessert
          </VBtn>
          <VBtn value="Beverages">
            Beverages
          </VBtn>
        </VBtnToggle>
      </VCardText>

      <VCardText class="mt-5">
        <VDataIterator
          v-model:items-per-page="rowPerPage"
          :items="menus"
          :page="page"
          :search="search"
        >
          <template #default="{ items }">
            <VRow>
              <VCol
                v-for="item in items"
                :key="item.raw.name"
                cols="12"
                md="4"
                sm="6"
              >
                <VCard>
                  <VImg
                    :src="item.raw.img"
                    height="231"
                    cover
                  />
                  <VCardItem>
                    <VCardTitle>{{ item.raw.name }}</VCardTitle>
                    <template #append>
                      <VChip
                        size="small"
                        variant="outlined"
                        color="info"
                      >
                        {{ item.raw.type }}
                      </VChip>
                    </template>
                  </VCardItem>

                  <VCardText>
                    {{ item.raw.desc }}
                  </VCardText>

                  <VCardText class="d-flex align-center flex-wrap gap-4">
                    <h6 class="text-h6 text-success">
                      $9.99
                    </h6>
                    <VSpacer />
                    <span>+5% Tax</span>
                  </VCardText>

                  <VCardText class="d-flex flex-sm-row flex-column gap-4">
                    <VBtn
                      color="primary"
                      class="flex-grow-1"
                      @click="editMenu(item.raw)"
                    >
                      Edit
                    </VBtn>
                    <VBtn
                      color="error"
                      class="flex-grow-1"
                      variant="tonal"
                    >
                      Delete
                    </VBtn>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </template>

          <template #footer="{ pageCount }">
            <div class="d-flex align-center flex-wrap gap-4 mt-6">
              <div class="d-flex align-center gap-1">
                <span>
                  Rows Per Page:
                </span>
                <VSelect
                  v-model="rowPerPage"
                  :items="[6, 10, 15, 20]"
                  style="inline-size: 5rem;"
                />
              </div>

              <VSpacer />

              <div>
                <VPagination
                  v-model="page"
                  active-color="primary"
                  :total-visible="5"
                  :length="pageCount"
                />
              </div>
            </div>
          </template>

          <template #no-data>
            <p class="text-base text-center">
              No data found!
            </p>
          </template>
        </VDataIterator>
      </VCardText>
    </VCard>

    <AddEditMenuDialog
      v-model:is-dialog-visible="isAddDialogVisible"
      :data="menu"
    />
  </div>
</template>
