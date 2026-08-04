<script setup>
import google from '@images/icons/google.png'
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="text-h5 font-weight-medium">
        Front-End Developer
      </VCardTitle>
    </VCardItem>

    <VCardText class="d-flex align-center text-base gap-3 flex-wrap">
      <div class="d-flex align-center gap-2">
        <VAvatar
          size="24"
          :image="google"
        />
        <h6 class="text-h6">
          Google
        </h6>
      </div>

      <span>|</span>

      <div class="d-flex align-center gap-2">
        <VIcon
          size="18"
          icon="mdi-map-marker-radius-outline"
        />
        <span>New York, USA</span>
      </div>

      <span>|</span>

      <div class="d-flex align-center gap-2">
        <VIcon
          size="18"
          icon="mdi-calendar-outline"
        />
        <span>Posted Yesterday</span>
      </div>
    </VCardText>

    <VCardText class="d-flex align-center gap-4 flex-wrap mt-5">
      <div>
        <p class="font-weight-medium mb-1">
          EXPERIENCE
        </p>
        <span class="text-medium-emphasis font-weight-medium">5+ Years</span>
      </div>

      <VDivider vertical />

      <div>
        <p class="font-weight-medium mb-1">
          LEVEL
        </p>
        <span class="text-medium-emphasis font-weight-medium">Senior Level</span>
      </div>

      <VDivider vertical />

      <div>
        <p class="font-weight-medium mb-1">
          EMPLOYMENT
        </p>
        <span class="text-medium-emphasis font-weight-medium">Full-Time</span>
      </div>

      <VDivider vertical />

      <div>
        <p class="font-weight-medium mb-1">
          SALARY
        </p>
        <span class="text-medium-emphasis font-weight-medium">$100-130k</span>
      </div>
    </VCardText>

    <VCardText>
      <h6 class="text-h6 mb-1">
        About Us
      </h6>
      <p>Google is a dynamic and innovative technology company dedicated to creating cutting-edge digital solutions that drive positive change in various industries. We are seeking a skilled and experienced Frontend Developer to join our growing team. If you are passionate about web development, have a strong track record in frontend technologies, and thrive in a collaborative environment, we want to hear from you.</p>
    </VCardText>

    <VCardText>
      <h6 class="text-h6 mb-1">
        Role Description
      </h6>
      <p>As a Frontend Developer at Google, you will play a pivotal role in shaping the user experience of our web applications. Your expertise will be essential in building responsive and visually appealing interfaces that engage our users and drive our business forward. You will work closely with our cross-functional teams, including designers, backend developers, and product managers, to bring our web applications to life.</p>

      <p class="font-weight-bold mb-1">
        Key Responsibilities
      </p>

      <VList
        density="compact"
        class="pa-0"
      >
        <VListItem>
          <p class="mb-1">
            <strong>Frontend Development:</strong> Collaborate with the design team to translate design concepts into functional and visually appealing web interfaces. Write clean, efficient, and maintainable code using HTML, CSS, and JavaScript.
          </p>
          <p class="mb-1">
            <strong>Responsive Design:</strong> Ensure that web applications are responsive and provide an optimal user experience across various devices and screen sizes.
          </p>
          <p class="mb-1">
            <strong>Optimization:</strong> Optimize frontend code and assets for performance, speed, and SEO best practices.
          </p>
          <p class="mb-1">
            <strong>Cross-Browser Compatibility:</strong> Ensure compatibility and consistency of web applications across different browsers.
          </p>
          <p class="mb-1">
            <strong>Collaboration:</strong> Work closely with cross-functional teams to understand project requirements and contribute to the overall product development process.
          </p>
          <p class="mb-1">
            <strong>Code Reviews:</strong> Participate in code reviews to maintain code quality and provide feedback to peers.
          </p>
          <p class="mb-1">
            <strong>Problem Solving:</strong> Troubleshoot and debug issues as they arise, proposing effective solutions.
          </p>
          <p class="mb-0">
            <strong>Documentation:</strong> Maintain clear and up-to-date documentation for frontend code and development processes.
          </p>
        </VListItem>
      </VList>
    </VCardText>

    <VCardText>
      <h6 class="text-h6 mb-1">
        Qualifications
      </h6>
      <VList class="pa-0">
        <VListItem>
          <p class="mb-1">
            Bachelor's degree in Computer Science, Web Development, or a related field preferred.
          </p>
          <p class="mb-1">
            Minimum of 5 years of professional experience in frontend web development.
          </p>
          <p class="mb-1">
            Proficiency in HTML5, CSS3, JavaScript, and related frontend technologies.
          </p>
          <p class="mb-1">
            Strong experience with modern JavaScript libraries and frameworks (e.g., React, Angular, or Vue.js).
          </p>
          <p class="mb-1">
            Solid understanding of responsive web design principles.
          </p>
          <p class="mb-0">
            Experience with version control systems (e.g., Git).
          </p>
        </VListItem>
      </VList>
    </VCardText>

    <VCardText>
      <h6 class="text-h6 mb-1">
        Qualifications
      </h6>

      <VList class="pa-0">
        <VListItem>
          <p class="mb-1">
            Competitive salary and benefits package.
          </p>
          <p class="mb-1">
            Opportunity to work on exciting projects and make a real impact.
          </p>
          <p class="mb-1">
            Collaborative and innovative work environment.
          </p>
          <p class="mb-1">
            Professional growth and development opportunities.
          </p>
          <p class="mb-0">
            Friendly and inclusive company culture.
          </p>
        </VListItem>
      </VList>

      <VBtn
        color="primary"
        class="mt-6"
      >
        Apply Now
      </VBtn>
    </VCardText>
  </VCard>
</template>
