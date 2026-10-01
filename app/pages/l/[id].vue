<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: lie } = await useFetch<Lie>(`/api/l/${id}`)
if (!lie.value) throw createError({ status: 404, message: 'Lie not found', fatal: true })

const url = useRequestURL()
const imageUrl = computed(() => lie.value?.image ? `${url.origin}/api/l/${id}/image` : undefined)

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

const title = computed(() => truncate(lie.value?.text ?? '', 70))
const description = computed(() => truncate(lie.value?.text ?? '', 200))

useHead({
  link: [{ rel: 'canonical', href: url.origin }],
})

useSeoMeta({
  title,
  description,

  ogType: 'article',
  ogUrl: url.origin,
  ogTitle: title,
  ogDescription: description,
  ogImage: imageUrl,
  ogImageAlt: () => imageUrl.value && description.value,

  articlePublishedTime: () => lie.value?.createdAt,

  twitterCard: () => imageUrl.value ? 'summary_large_image' : 'summary',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: imageUrl,
  twitterImageAlt: () => imageUrl.value && description.value,
})
</script>

<template>
  <UCard v-if="lie">
    <p class="whitespace-pre-wrap">
      {{ lie.text }}
    </p>
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="lie.text"
      class="mt-3 rounded-md max-h-96"
    >
    <template #footer>
      <NuxtTime
        :datetime="lie.createdAt"
        date-style="medium"
        time-style="short"
        class="text-sm text-muted"
      />
    </template>
  </UCard>
</template>
