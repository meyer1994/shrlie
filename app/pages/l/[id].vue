<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: lie } = await useFetch<Lie & { views: number }>(`/api/l/${id}`)
if (!lie.value) throw createError({ status: 404, message: 'Lie not found', fatal: true })

const url = useRequestURL()
const imageUrl = computed(() => lie.value?.image ? `${url.origin}/api/l/${id}/image` : undefined)

const title = computed(() => lie.value?.title ?? truncate(lie.value?.text ?? '', 70))
const description = computed(() => lie.value?.description ?? truncate(lie.value?.text ?? '', 200))
const imageAlt = computed(() => lie.value?.imageAlt ?? description.value)
const twitterCreator = computed(() => lie.value?.twitter ? `@${lie.value.twitter}` : undefined)

useHead({
  link: [{ rel: 'canonical', href: url.origin }],
})

useSeoMeta({
  title,
  description,
  author: () => lie.value?.author,

  ogType: 'article',
  ogUrl: url.origin,
  ogTitle: title,
  ogDescription: description,
  ogImage: imageUrl,
  ogImageAlt: () => imageUrl.value && imageAlt.value,

  articlePublishedTime: () => lie.value?.createdAt,
  articleAuthor: () => lie.value?.author ? [lie.value.author] : undefined,

  twitterCard: () => imageUrl.value ? 'summary_large_image' : 'summary',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: imageUrl,
  twitterImageAlt: () => imageUrl.value && imageAlt.value,
  twitterCreator,
})
</script>

<template>
  <article
    v-if="lie"
    class="space-y-4"
  >
    <header class="space-y-3 text-center">
      <p class="text-xs uppercase tracking-[0.3em] text-primary">
        Exclusive
      </p>
      <h1 class="font-headline text-4xl sm:text-5xl font-black leading-tight text-balance text-highlighted">
        {{ title }}
      </h1>
      <p class="italic text-lg text-muted">
        {{ lie.description ?? 'Sources close to the matter could not be reached for comment.' }}
      </p>
      <p class="py-2 border-y border-default text-xs uppercase tracking-widest text-muted">
        By {{ lie.author ?? 'an Anonymous Source' }}
        <template v-if="twitterCreator">
          ({{ twitterCreator }})
        </template>
        ·
        <NuxtTime
          :datetime="lie.createdAt"
          date-style="long"
          time-style="short"
        />
        · Read {{ lie.views.toLocaleString('en-US') }} {{ lie.views === 1 ? 'time' : 'times' }}
      </p>
    </header>

    <figure v-if="imageUrl">
      <div class="relative after:absolute after:inset-0 after:pointer-events-none after:mix-blend-multiply after:bg-[image:repeating-linear-gradient(-45deg,rgb(0_0_0/0.18)_0_1px,transparent_1px_4px)]">
        <img
          :src="imageUrl"
          :alt="imageAlt"
          class="block w-full max-h-[32rem] object-cover grayscale contrast-125 border border-default"
        >
      </div>
      <figcaption class="mt-1 text-xs italic text-muted text-right">
        {{ lie.imageAlt ?? 'Photograph obtained by The Shrlie Times.' }}
      </figcaption>
    </figure>

    <p
      class="whitespace-pre-wrap text-justify hyphens-auto leading-relaxed gap-8 [column-rule:1px_solid_var(--ui-border)] first-letter:float-left first-letter:mr-2 first-letter:font-headline first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-highlighted after:content-['_∎']"
      :class="{ 'sm:columns-2': lie.text.length > 280 }"
      v-text="lie.text"
    />
  </article>
</template>
