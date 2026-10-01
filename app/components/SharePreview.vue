<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  image?: File | null
  imageAlt?: string
}>()

const host = useRequestURL().host
const imageUrl = useObjectUrl(() => props.image)
</script>

<template>
  <div class="overflow-hidden rounded-[16px] border border-default bg-default [font-family:system-ui,sans-serif]">
    <div
      v-if="imageUrl"
      class="relative aspect-[1.91/1] border-b border-default"
    >
      <img
        :src="imageUrl"
        :alt="imageAlt || description"
        class="size-full object-cover"
      >
      <span class="absolute bottom-2 left-2 rounded-[4px] px-1.5 py-0.5 bg-black/70 text-xs text-white">
        {{ host }}
      </span>
    </div>

    <div class="flex">
      <div
        v-if="!imageUrl"
        class="w-28 shrink-0 grid place-items-center border-r border-default bg-elevated text-muted"
      >
        <UIcon
          name="i-lucide-newspaper"
          class="size-8"
        />
      </div>
      <div class="min-w-0 p-3 space-y-0.5">
        <p class="text-xs text-muted">
          {{ host }}
        </p>
        <p class="font-semibold text-highlighted line-clamp-2">
          {{ title }}
        </p>
        <p class="text-sm text-muted line-clamp-2">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
