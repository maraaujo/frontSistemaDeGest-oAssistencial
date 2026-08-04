<script setup>
import axios from '@axios'

const searchByRole = ref('Front End Developer')
const searchByLocation = ref('United State')
const workType = ref('Remote')
const salaryRange = ref('$50k-100k')
const jobs = ref([])
const page = ref(1)
const formatting = ref('list-view')
const sortBy = ref('Newest')
const rowPerPage = ref(6)

const fetchJobs = async () => {
  try {
    const res = await axios.get('/jobs', {
      params: {
        searchByRole: searchByRole.value,
        searchByLocation: searchByLocation.value,
        workType: workType.value,
        salaryRange: salaryRange.value,
      },
    })

    jobs.value = res.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchJobs)
</script>

<template>
  <div>
    <VCard
      class="mb-6"
      title="Filters"
    >
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VTextField
              v-model="searchByRole"
              label="Search by role"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search your role..."
            />
          </VCol>

          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VTextField
              v-model="searchByLocation"
              label="Search by location"
              prepend-inner-icon="mdi-map-marker-radius-outline"
              placeholder="United State"
            />
          </VCol>

          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VSelect
              v-model="workType"
              label="Work Type"
              prepend-inner-icon="mdi-briefcase-variant-outline"
              :items="['Remote', 'Onsite', 'Hybrid', 'Full-Time']"
              clear-icon="mdi-close"
              clearable
            />
          </VCol>

          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VSelect
              v-model="salaryRange"
              label="Salary Range"
              prepend-inner-icon="mdi-currency-usd"
              :items="['$50k-100k', '$100k-200k', '$200k-300k', '$300k-500k']"
              clear-icon="mdi-close"
              clearable
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <VCardText class="d-flex align-center gap-4 flex-wrap">
        <div>
          <h6 class="text-h6">
            Showing Results: {{ jobs.length }}
          </h6>
          <p class="mb-0">
            {{ searchByRole ? `${searchByRole} |` : '' }}
            {{ searchByLocation ? `${searchByLocation} |` : '' }}
            {{ workType ? `${workType} |` : '' }}
            {{ salaryRange }}
          </p>
        </div>

        <VSpacer />

        <div class="d-flex align-center gap-4">
          <VBtnToggle
            v-model="formatting"
            density="compact"
            variant="outlined"
            divided
          >
            <VBtn
              value="list-view"
              size="small"
            >
              <VIcon
                size="20"
                icon="mdi-format-list-bulleted"
              />
            </VBtn>
            <VBtn
              value="grid-view"
              size="small"
            >
              <VIcon
                size="20"
                icon="mdi-apps"
              />
            </VBtn>
          </VBtnToggle>

          <VSelect
            v-model="sortBy"
            label="Sort By"
            prepend-inner-icon="mdi-filter-outline"
            :items="['Best Match', 'Newest', 'Relevance', 'Salary High To Low', 'Salary Low To High']"
            style="inline-size: 11.2rem;"
            clear-icon="mdi-close"
            clearable
          />
        </div>
      </VCardText>

      <VCardText>
        <VDataIterator
          v-model:items-per-page="rowPerPage"
          :items="jobs"
          :page="page"
        >
          <template #default="{ items }">
            <VRow>
              <template
                v-for="item in items"
                :key="item.raw.name"
              >
                <VCol
                  v-if="formatting === 'list-view'"
                  cols="12"
                >
                  <VCard
                    variant="outlined"
                    :to="{ name: 'ecommerce-jobs-details' }"
                    :ripple="false"
                    :class="`border-${item.raw.color}`"
                  >
                    <VCardItem>
                      <div class="d-flex align-center flex-wrap">
                        <div class="d-flex align-start gap-3">
                          <VAvatar
                            size="x-small"
                            :image="item.raw.companyLogo"
                            class="mt-1"
                          />
                          <div>
                            <VCardTitle>{{ item.raw.name }}</VCardTitle>
                            <VCardSubtitle>
                              <VIcon
                                size="16"
                                icon="mdi-map-marker-radius-outline"
                              /> {{ item.raw.location }} | ${{ item.raw.salary }}
                            </VCardSubtitle>
                          </div>
                        </div>
                        <VSpacer />
                        <div class="d-flex flex-sm-column align-center align-sm-end gap-2">
                          <VBtn
                            icon
                            variant="text"
                            size="x-small"
                          >
                            <VIcon
                              size="18"
                              icon="mdi-bookmark-outline"
                            />
                          </VBtn>
                          <span>{{ item.raw.postedDate }}</span>
                        </div>
                      </div>
                    </VCardItem>

                    <VCardText class="d-flex align-center flex-wrap gap-2">
                      <VChip
                        v-for="data in item.raw.employment"
                        :key="data"
                        size="small"
                        :color="item.raw.color"
                        variant="outlined"
                      >
                        {{ data }}
                      </VChip>
                    </VCardText>
                  </VCard>
                </VCol>

                <VCol
                  v-else
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <VCard
                    variant="outlined"
                    :class="`border-${item.raw.color}`"
                  >
                    <VCardText :class="`bg-light-${item.raw.color} rounded ma-2`">
                      <div class="d-flex align-center flex-wrap mb-4">
                        <VChip
                          :color="item.raw.color"
                          size="small"
                          variant="flat"
                        >
                          {{ new Date(item.raw.postedDate).toDateString() }}
                        </VChip>

                        <VSpacer />

                        <VBtn
                          icon
                          size="small"
                          :color="item.raw.color"
                          variant="text"
                        >
                          <VIcon icon="mdi-bookmark-outline" />
                        </VBtn>
                      </div>
                      <div class="d-flex align-center gap-3 mb-2">
                        <VAvatar
                          size="22"
                          :image="item.raw.companyLogo"
                        />
                        <h6 class="text-sm font-weight-medium">
                          {{ item.raw.companyName }}
                        </h6>
                      </div>
                      <h5 class="text-h6 font-weight-medium mb-3">
                        {{ item.raw.name }}
                      </h5>

                      <div class="d-flex align-center flex-wrap gap-2">
                        <VChip
                          v-for="data in item.raw.employment"
                          :key="data"
                          size="x-small"
                          :color="item.raw.color"
                          variant="outlined"
                        >
                          {{ data }}
                        </VChip>
                      </div>
                    </VCardText>

                    <VCardText class="d-flex align-center flex-wrap gap-1 mt-5">
                      <h6 class="text-base font-weight-medium">
                        ${{ item.raw.salary }}
                      </h6>
                      <VSpacer />
                      <VIcon
                        size="16"
                        icon="mdi-map-marker-radius-outline"
                      />
                      <span>{{ item.raw.location }}</span>
                    </VCardText>
                    <VCardText>
                      <VBtn
                        block
                        :color="item.raw.color"
                        variant="outlined"
                        :to="{ name: 'ecommerce-jobs-details' }"
                      >
                        View
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VCol>
              </template>
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
  </div>
</template>
