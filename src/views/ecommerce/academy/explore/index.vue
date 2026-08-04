<script setup>
import cover from '@images/pages/academy-banner.jpg'
import { kFormatter } from '@/utils/kFormatter'
import axios from '@axios'

const tags = ref([
  'low-to-high-price',
  'high-to-low-price',
  '4-stars',
])

const filters = ref([
  {
    text: 'Low to high price',
    value: 'low-to-high-price',
    prependIcon: 'mdi-trending-up',
  },
  {
    text: 'High to low price',
    value: 'high-to-low-price',
    prependIcon: 'mdi-trending-down',
  },
  {
    text: '4 Stars',
    value: '4-stars',
    prependIcon: 'mdi-star-outline',
  },
])

const courses = ref([])
const search = ref('')
const page = ref(1)
const rowPerPage = ref(6)
const currentFilterByTab = ref()

const filtersByTab = [
  {
    name: 'All',
    value: 'all',
  },
  {
    name: 'My learning',
    value: 'my-learning',
  },
  {
    name: 'Latest',
    value: 'latest',
  },
  {
    name: 'Recent Updated',
    value: 'recent-updated',
  },
  {
    name: 'Free',
    value: 'free',
  },
]

const fetchCourses = () => {
  axios.get('/academy/courses', { params: { q: currentFilterByTab.value } }).then(response => {
    courses.value = response.data.courses
  })
}

watch(currentFilterByTab, fetchCourses, { immediate: true })

const removeTag = tag => {
  const index = tags.value.findIndex(i => i === tag)

  tags.value.splice(index, 1)
}

const calculateDiscount = (price, discountPercentage) => {
  return price * (1 - discountPercentage / 100)
}

// breadcrumbs
const breadcrumbs = [
  {
    title: 'Home',
    disabled: false,
    to: { path: '/' },
  },
  {
    title: 'Academy',
    disabled: true,
  },
  {
    title: 'Explore',
    disabled: true,
  },
]
</script>

<template>
  <VRow>
    <!-- Breadcrumbs -->
    <VCol cols="12">
      <VBreadcrumbs
        :items="breadcrumbs"
        divider="-"
        class="px-0"
      />
    </VCol>

    <VCol cols="12">
      <VCard>
        <VImg
          :src="cover"
          cover
          gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.3)"
        />

        <VCardText
          class="d-flex flex-column align-center"
          style="margin-block-start: -7rem;"
        >
          <div class="w-100 mt-16">
            <VTextField
              v-model="search"
              variant="solo"
              density="default"
              prepend-inner-icon="mdi-magnify"
              placeholder="Type your keywords"
              bg-color="surface"
              style="max-inline-size: 40rem;"
              class="mx-auto"
            >
              <template #append-inner>
                <VBtn
                  color="info"
                  size="small"
                  elevation="0"
                  icon="mdi-arrow-right"
                />
              </template>
            </VTextField>
          </div>
        </VCardText>

        <VCardText>
          <div class="d-flex justify-space-between gap-4 mt-10">
            <VTabs v-model="currentFilterByTab">
              <VTab
                v-for="item in filtersByTab"
                :key="item.value"
                :value="item.value"
              >
                {{ item.name }}
              </VTab>
            </VTabs>
            <div>
              <VBtn color="info">
                <VIcon icon="mdi-filter-outline" />
                <span class="d-none d-sm-block ms-1">Filters</span>

                <VMenu activator="parent">
                  <VList
                    v-model:selected="tags"
                    select-strategy="classic"
                    :items="filters"
                    item-title="text"
                  />
                </VMenu>
              </VBtn>
            </div>
          </div>

          <VDivider />
        </VCardText>

        <VCardText
          class="d-flex flex-wrap gap-2"
          style="min-block-size: 2.875rem;"
        >
          <VChip
            v-for="tag in tags"
            v-show="filters.filter((f) => f.value === tag).length"
            :key="tag"
            v-bind="filters.filter((f) => f.value === tag)[0]"
            closable
            label
            size="small"
            color="primary"
            close-icon="mdi-close-circle-outline"
            @click:close="removeTag(tag)"
          />
        </VCardText>

        <VCardText>
          <VDataIterator
            v-if="courses && courses.length"
            v-model:items-per-page="rowPerPage"
            :items="courses"
            :page="page"
            :search="search"
          >
            <template #default="{ items }">
              <VRow>
                <VCol
                  v-for="(item, i) in items"
                  :key="i"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <VCard variant="outlined">
                    <VImg
                      :src="item.raw.courseBanner"
                      height="200"
                      cover
                    />

                    <VCardText class="d-flex mt-n12 pb-0">
                      <VSpacer />
                      <VBtn
                        icon
                        elevation="10"
                        :color="item.raw.purchased ? 'error' : 'info'"
                        class="buy-or-play-btn"
                        :to="{ name: 'ecommerce-academy-details' }"
                      >
                        <VIcon
                          size="22"
                          :icon="item.raw.purchased ? 'mdi-play' : 'mdi-cart-plus'"
                        />
                      </VBtn>
                    </VCardText>

                    <VCardText class="mt-4">
                      <div class="d-flex align-center justify-space-between mb-3">
                        <div>
                          <h6 class="text-h6">
                            {{ item.raw.name }}
                          </h6>
                          <span class="text-medium-emphasis text-truncate">{{ item.raw.description }}</span>
                        </div>
                      </div>

                      <div class="d-flex align-center flex-wrap text-medium-emphasis gap-3 mb-3">
                        <div class="d-flex align-center gap-2">
                          <VIcon
                            color="error"
                            size="18"
                            icon="mdi-play-circle-outline"
                          />
                          <span>{{ item.raw.hours }} hours</span>
                        </div>

                        <VDivider vertical />

                        <div class="d-flex align-center gap-2">
                          <VIcon
                            color="info"
                            size="18"
                            icon="mdi-book-open-outline"
                          />
                          <span>{{ item.raw.hours }} Chapter</span>
                        </div>

                        <VDivider vertical />

                        <div class="d-flex align-center gap-2">
                          <VIcon
                            color="success"
                            size="18"
                            icon="mdi-account-multiple-outline"
                          />
                          <span>{{ kFormatter(item.raw.enrolls) }} Enrolls</span>
                        </div>
                      </div>

                      <div class="d-flex align-center gap-1">
                        <VAvatar
                          :image="item.raw.tutor.img"
                          size="22"
                          class="me-1"
                        />
                        <strong>By</strong>
                        <a href="javascript:void(0)">{{ item.raw.tutor.name }}</a>
                        <VSpacer />

                        <VRating
                          density="compact"
                          size="18"
                          readonly
                          half-increments
                          :model-value="item.raw.rating"
                        />
                      </div>

                      <VDivider class="my-4" />

                      <div
                        v-if="item.raw.purchased"
                        class="d-flex flex-wrap gap-3"
                      >
                        <VBtn
                          color="primary"
                          prepend-icon="mdi-refresh"
                          class="flex-grow-1"
                          :to="{ name: 'ecommerce-academy-details' }"
                        >
                          Start Leaning
                        </VBtn>
                        <VBtn
                          class="flex-grow-1"
                          variant="tonal"
                          color="info"
                          :to="{ name: 'ecommerce-academy-details' }"
                        >
                          View
                        </VBtn>
                      </div>

                      <div
                        v-else
                        class="d-flex align-center"
                      >
                        <template v-if="item.raw.price">
                          <span class="text-decoration-line-through text-base font-weight-medium text-disabled me-1">
                            ${{ item.raw.price }}
                          </span>
                          <span class="font-weight-bold text-success text-base">
                            ${{ calculateDiscount(item.raw.price, item.raw.discount) }}
                          </span>
                        </template>

                        <span
                          v-else
                          class="font-weight-bold text-success text-base"
                        >
                          Free
                        </span>

                        <VSpacer />

                        <VBtn
                          color="primary"
                          variant="tonal"
                          prepend-icon="mdi-account-plus-outline"
                        >
                          Enroll Now
                        </VBtn>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </template>

            <template #no-data>
              <h6 class="text-h6 text-center mt-4">
                No data found!
              </h6>
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
          </VDataIterator>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.buy-or-play-btn {
  transition: none;
}
</style>
