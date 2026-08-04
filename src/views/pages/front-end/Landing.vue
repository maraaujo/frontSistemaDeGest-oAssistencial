<script setup>
import FaqCard from '@/views/pages/front-end/Faq.vue'
import FeatureCard from '@/views/pages/front-end/Feature.vue'
import FeatureCardV2 from '@/views/pages/front-end/FeatureV2.vue'
import FooterCard from '@/views/pages/front-end/Footer.vue'
import HeroSection from '@/views/pages/front-end/Hero.vue'
import MasonryReview from '@/views/pages/front-end/MasonryReview.vue'
import Navbar from '@/views/pages/front-end/Navbar.vue'
import PricingCard from '@/views/pages/front-end/Pricing.vue'

const features = [
  {
    subtitle: 'Feature 1',
    title: 'Lorem ipsum dolor sit amet',
    description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    reverse: false,
  },
  {
    subtitle: 'Feature 2',
    title: 'Lorem ipsum dolor sit amet',
    description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    reverse: true,
  },
  {
    subtitle: 'Feature 3',
    title: 'Lorem ipsum dolor sit amet',
    description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    reverse: false,
  },
  {
    subtitle: 'Feature 4',
    title: 'Lorem ipsum dolor sit amet',
    description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p> <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    reverse: true,
  },
]
</script>

<template>
  <VContainer class="pt-0">
    <Navbar />

    <!-- hero section -->
    <HeroSection />

    <!-- feature  -->
    <div
      id="features"
      class="pt-16"
    >
      <div class="text-center">
        <h6 class="text-h6 text-primary">
          Features
        </h6>
        <h2 class="text-md-h2 text-sm-h3">
          Why choose our service?
        </h2>
        <P>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </P>
      </div>

      <VRow class="mt-10 ">
        <VCol
          v-for="i in 6"
          :key="i"
          cols="12"
          md="4"
        >
          <FeatureCard
            :title="`Feature ${i}`"
            icon="mdi-cog-outline"
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur pariatur vitae ipsum porro! Est libero quis cumque a distinctio adipisci debitis aliquam, tenetur asperiores obcaecati repellendus aliquid voluptas, hic harum?"
          />
        </VCol>
      </VRow>
    </div>

    <!-- feature version 2 -->
    <div class="pt-10 mt-16">
      <VRow>
        <VCol
          v-for="feature in features"
          :key="feature.title"
          cols="12"
        >
          <FeatureCardV2
            :title="feature.title"
            :subtitle="feature.subtitle"
            :description="feature.description"
            :reverse="feature.reverse"
          />
        </VCol>
      </VRow>
    </div>

    <!-- pricing  -->
    <div
      id="pricing"
      class="mt-16 pt-16"
    >
      <div class="text-center mb-10">
        <h6 class="text-h6 text-primary">
          Pricing
        </h6>
        <h2 class="text-md-h2 text-sm-h3">
          Choose your Pricing plan
        </h2>
        <P>
          Tiramisu sugar plum danish chocolate pie cake bonbon cake candy.
        </P>
      </div>

      <PricingCard />
    </div>

    <!-- Testimonials  -->
    <div
      id="testimonials"
      class="mt-16 pt-16"
    >
      <div class="text-center mb-10">
        <h6 class="text-h6 text-primary">
          Testimonials
        </h6>
        <h2 class="text-md-h2 text-sm-h3">
          What our customers are saying.
        </h2>
        <P>
          Proident sunt exercitation minim laborum enim laboris labore esse.
        </P>
      </div>

      <MasonryReview />
    </div>

    <!-- faqs  -->
    <div
      id="faqs"
      class="mt-16 pt-16 mb-10"
    >
      <div class="mb-10 text-center">
        <h6 class="text-h6 text-primary">
          FAQs
        </h6>
        <h2 class="text-md-h2 text-sm-h3">
          Frequently asked questions
        </h2>
        <P>
          Proident sunt exercitation minim laborum enim laboris labore esse.
        </P>
      </div>

      <FaqCard />
    </div>
  </VContainer>

  <!-- footer -->
  <FooterCard />
</template>
