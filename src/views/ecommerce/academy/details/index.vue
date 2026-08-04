<script setup>
import { VideoPlayer } from '@videojs-player/vue'
import avatar1 from '@images/avatars/avatar-1.png'
import 'video.js/dist/video-js.css'

const currentSelected = ref('overview')
const panel = ref(0)

const videoTab = [
  {
    name: 'Overview',
    value: 'overview',
  },
  {
    name: 'Notes',
    value: 'notes',
  },
  {
    name: 'Resources',
    value: 'resources',
  },
  {
    name: 'Q&A',
    value: 'qna',
  },
]

const courseContent = [
  {
    name: 'Chapter 1',
    completed: 100,
    topics: [
      {
        name: 'Lesson 1',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 2',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 3',
        duration: '4:00 Mins',
      },
      {
        name: 'Lesson 4',
        duration: '10:00 Mins',
      },
      {
        name: 'Lesson 5',
        duration: '3:00 Mins',
      },
    ],
  },
  {
    name: 'Chapter 2',
    completed: 70,
    topics: [
      {
        name: 'Lesson 1',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 2',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 3',
        duration: '4:00 Mins',
      },
      {
        name: 'Lesson 4',
        duration: '10:00 Mins',
      },
      {
        name: 'Lesson 5',
        duration: '3:00 Mins',
      },
    ],
  },
  {
    name: 'Chapter 3',
    completed: 30,
    topics: [
      {
        name: 'Lesson 1',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 2',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 3',
        duration: '4:00 Mins',
      },
      {
        name: 'Lesson 4',
        duration: '10:00 Mins',
      },
      {
        name: 'Lesson 5',
        duration: '3:00 Mins',
      },
    ],
  },
  {
    name: 'Chapter 4',
    completed: 0,
    topics: [
      {
        name: 'Lesson 1',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 2',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 3',
        duration: '4:00 Mins',
      },
      {
        name: 'Lesson 4',
        duration: '10:00 Mins',
      },
      {
        name: 'Lesson 5',
        duration: '3:00 Mins',
      },
    ],
  },
  {
    name: 'Chapter 5',
    completed: 0,
    topics: [
      {
        name: 'Lesson 1',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 2',
        duration: '5:00 Mins',
      },
      {
        name: 'Lesson 3',
        duration: '4:00 Mins',
      },
      {
        name: 'Lesson 4',
        duration: '10:00 Mins',
      },
      {
        name: 'Lesson 5',
        duration: '3:00 Mins',
      },
    ],
  },
]
</script>

<template>
  <VCard>
    <VRow>
      <VCol
        cols="12"
        md="8"
        class="border-e"
      >
        <VCardItem>
          <VCardTitle>Design Mastery Course</VCardTitle>
          <VCardSubtitle>Ozzy Osbourne, Design Department</VCardSubtitle>

          <template #append>
            <VBtnToggle
              variant="outlined"
              divided
              density="comfortable"
            >
              <VBtn icon="mdi-chevron-left" />
              <VBtn icon="mdi-chevron-right" />
            </VBtnToggle>
          </template>
        </VCardItem>

        <VCardText>
          <VideoPlayer
            src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
            poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
            controls
            plays-inline
            class="w-100 rounded"
            :height="400"
          />
        </VCardText>

        <VCardText>
          <VTabs v-model="currentSelected">
            <VTab
              v-for="tab in videoTab"
              :key="tab.name"
              :value="tab.value"
            >
              {{ tab.name }}
            </VTab>
          </VTabs>
          <VDivider class="mb-4" />

          <VWindow v-model="currentSelected">
            <VWindowItem value="overview">
              <h5 class="text-h6 mb-3">
                About this course
              </h5>
              <p>
                Cupcake pie cake candy canes pudding carrot cake. Muffin chocolate bar oat cake tiramisu sugar plum jelly cake. Cotton candy chocolate cake pudding chocolate cake gummies biscuit cotton candy candy canes cookie.
              </p>
              <p>
                Shortbread lemon drops sesame snaps jujubes jelly-o danish fruitcake. Chocolate cake bonbon candy canes donut tiramisu gummi bears caramels sweet roll. Tootsie roll donut cookie candy canes pastry pudding. Tart brownie carrot cake cake dragée gummies.
              </p>
              <p>
                Topping tiramisu sesame snaps powder apple pie. Icing cookie lollipop marzipan liquorice bonbon oat cake candy. Chocolate cake jelly dessert candy sugar plum muffin bear claw cookie sweet roll. Cookie sesame snaps brownie jujubes oat cake bear claw.
              </p>

              <h5 class="text-h6 mb-3">
                Instructor
              </h5>

              <div class="d-flex align-center gap-3 mb-3">
                <VAvatar :image="avatar1" />
                <div>
                  <h6 class="text-base font-weight-medium">
                    Ozzy Osbourne
                  </h6>
                  <p class="mb-0">
                    Design Department
                  </p>
                </div>
              </div>

              <p>Donut biscuit muffin bear claw caramels candy jelly-o shortbread. Candy canes danish gummi bears cake fruitcake bonbon pastry donut. Chocolate dessert biscuit chocolate cake chupa chups sugar plum.</p>
            </VWindowItem>

            <VWindowItem value="notes">
              <VCard
                variant="outlined"
                class="mb-6"
              >
                <VCardText>
                  <p class="font-weight-medium text-base">
                    Getting Started
                  </p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae illo ducimus beatae omnis aperiam possimus pariatur officia modi ad numquam nostrum quas, cupiditate optio quos ipsum consequatur est velit exercitationem.
                </VCardText>
              </VCard>

              <VCard variant="outlined">
                <VCardText>
                  <p class="font-weight-medium text-base">
                    Getting Started
                  </p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae illo ducimus beatae omnis aperiam possimus pariatur officia modi ad numquam nostrum quas, cupiditate optio quos ipsum consequatur est velit exercitationem.
                </VCardText>
              </VCard>
            </VWindowItem>

            <VWindowItem value="resources">
              <VCard
                variant="outlined"
                class="mb-6"
              >
                <VCardText>
                  <div class="d-flex align-center flex-wrap gap-3">
                    <p class="font-weight-medium text-base mb-2">
                      Chapter 4
                    </p>
                    <VSpacer />
                    <VBtn
                      icon
                      size="x-small"
                      variant="text"
                    >
                      <VIcon
                        size="20"
                        icon="mdi-tray-arrow-down"
                      />
                    </VBtn>
                  </div>
                  <p class="mb-1">
                    layout-figma-file.zip
                  </p>
                  <span>500kb</span>
                </VCardText>
              </VCard>

              <VCard variant="outlined">
                <VCardText>
                  <div class="d-flex align-center flex-wrap gap-3">
                    <p class="font-weight-medium text-base mb-2">
                      Chapter 11
                    </p>
                    <VSpacer />
                    <VBtn
                      icon
                      size="x-small"
                      variant="text"
                    >
                      <VIcon
                        size="20"
                        icon="mdi-tray-arrow-down"
                      />
                    </VBtn>
                  </div>
                  <p class="mb-1">
                    animation-css-file.zip
                  </p>
                  <span>17kb</span>
                </VCardText>
              </VCard>
            </VWindowItem>

            <VWindowItem value="qna">
              <div class="mb-4">
                <div class="d-flex align-center gap-2 mb-3">
                  <VAvatar
                    size="28"
                    :image="avatar1"
                  />
                  <span class="text-base font-weight-medium">Lita Ford</span>
                </div>
                <p class="mb-2">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry...
                </p>
                <div class="d-flex align-center gap-4">
                  <VBtn
                    variant="text"
                    size="small"
                    color="secondary"
                    prepend-icon="mdi-reply-outline"
                  >
                    Reply
                  </VBtn>
                  <span class="text-xs">Show 10 Replies</span>
                </div>
              </div>
              <VDivider />

              <div class="my-4">
                <div class="d-flex align-center gap-2 mb-3">
                  <VAvatar
                    size="28"
                    :image="avatar1"
                  />
                  <span class="text-base font-weight-medium">Lita Ford</span>
                </div>
                <p class="mb-2">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry...
                </p>
                <div class="d-flex align-center gap-4">
                  <VBtn
                    variant="text"
                    size="small"
                    color="secondary"
                    prepend-icon="mdi-reply-outline"
                  >
                    Reply
                  </VBtn>
                  <span class="text-xs">Show 10 Replies</span>
                </div>
              </div>

              <VDivider />

              <VTextField
                placeholder="Ask a question..."
                class="mt-4"
              >
                <template #append-inner>
                  <VBtn
                    icon
                    variant="text"
                    size="x-small"
                  >
                    <VIcon icon="mdi-send-outline" />
                  </VBtn>
                </template>
              </VTextField>
            </VWindowItem>
          </VWindow>
        </VCardText>
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <VCardItem>
          <VCardTitle>Course Content</VCardTitle>
        </VCardItem>
        <VCardText>
          <div class="d-flex align-center flex-wrap gap-2 mb-2">
            <span>3/5 completed</span>
            <VSpacer />
            <VIcon
              color="warning"
              icon="mdi-trophy-outline"
            />
          </div>
          <VProgressLinear
            color="primary"
            height="8"
            model-value="60"
            rounded
            rounded-bar
          />
        </VCardText>

        <VCardText>
          <VExpansionPanels
            v-model="panel"
            variant="accordion"
          >
            <VExpansionPanel
              v-for="(item, index) in courseContent"
              :key="item.name"
            >
              <template #title>
                <div class="d-flex align-center flex-wrap gap-3">
                  <VProgressCircular
                    color="primary"
                    :model-value="item.completed"
                    size="26"
                    :width="2"
                  >
                    {{ index + 1 }}
                  </VProgressCircular>
                  {{ item.name }}
                </div>
              </template>
              <template #text>
                <VList
                  lines="one"
                  class="pa-0"
                >
                  <VListItem
                    v-for="i in item.topics"
                    :key="i.name"
                    class="px-0"
                  >
                    <template #prepend>
                      <VIcon
                        :color="item.completed === 100 ? 'primary' : ''"
                        icon="mdi-checkbox-marked-outline"
                      />
                    </template>
                    <VListItemTitle class="text-sm">
                      {{ i.name }}
                    </VListItemTitle>
                    <template #append>
                      <span class="text-xs text-medium-emphasis">{{ i.duration }}</span>
                    </template>
                  </VListItem>
                </VList>
              </template>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
