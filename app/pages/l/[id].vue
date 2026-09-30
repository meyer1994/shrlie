<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: lie } = await useFetch<Lie>(`/api/l/${id}`)
if (!lie.value) {
  throw createError({ statusCode: 404, statusMessage: 'Lie not found', fatal: true })
}

const imageUrl = computed(() => lie.value?.image ? `/api/l/${id}/image` : undefined)
const origin = useRequestURL().origin

useSeoMeta({
  title: () => lie.value?.text,
  ogTitle: () => lie.value?.text,
  ogImage: () => imageUrl.value && `${origin}${imageUrl.value}`,
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
