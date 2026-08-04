<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
</script>

<template>
  <div class="d-flex flex-wrap gap-4">
    <VAvatar :image="avatar1" />
    <VAvatar :image="avatar2" />
    <VAvatar :image="avatar3" />
    <VAvatar :image="avatar4" />
    <VAvatar :image="avatar5" />
    <VAvatar :image="avatar6" />
    <VAvatar :image="avatar7" />
  </div>
</template>
