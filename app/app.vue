<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} - The Shrlie Times` : 'The Shrlie Times',
})

useSeoMeta({
  description: 'All the News That’s Fit to Fake',
  ogSiteName: 'The Shrlie Times',
  ogType: 'website',
  ogTitle: 'The Shrlie Times',
  ogDescription: 'All the News That’s Fit to Fake',
  twitterCard: 'summary',
})
</script>

<template>
  <UApp>
    <UContainer class="max-w-3xl py-16 space-y-6">
      <header class="text-center">
        <div class="pb-2 flex items-center justify-between gap-3 border-b border-default">
          <span class="text-xs uppercase tracking-widest text-muted">
            Vol. I · No. 1
          </span>
          <UColorModeButton />
        </div>

        <NuxtLink
          to="/"
          class="block mt-4 font-headline font-black tracking-tight text-4xl sm:text-6xl text-highlighted"
        >
          The Shrlie Times
        </NuxtLink>
        <div class="mt-3 py-1 flex justify-between gap-3 border-y-4 border-double border-inverted text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap">
          <NuxtTime
            :datetime="new Date()"
            date-style="medium"
            class="sm:hidden"
          />
          <NuxtTime
            :datetime="new Date()"
            date-style="full"
            class="hidden sm:inline"
          />
          <span class="hidden sm:inline italic normal-case tracking-normal">
            “All the News That’s Fit to Fake”
          </span>
          <span>Price: One Lie</span>
        </div>
      </header>

      <NuxtPage />
    </UContainer>
  </UApp>
</template>
