<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} - shrlie` : 'shrlie',
})

useSeoMeta({
  description: 'Share a lie',
  ogSiteName: 'shrlie',
  ogType: 'website',
  ogTitle: 'shrlie',
  ogDescription: 'Share a lie',
  twitterCard: 'summary',
})
</script>

<template>
  <UApp>
    <UContainer class="max-w-xl py-16 space-y-6">
      <NuxtLink
        to="/"
        class="block text-3xl font-bold"
      >
        shrlie
      </NuxtLink>

      <NuxtPage />
    </UContainer>
  </UApp>
</template>
