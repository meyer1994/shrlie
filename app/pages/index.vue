<script setup lang="ts">
import * as z from 'zod'
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  text: z.string()
    .trim()
    .min(1, 'Every story needs at least one word.')
    .max(1024),
  image: z.file()
    .max(5 * 1024 * 1024, 'Photographs must be under 5MB.')
    .mime(['image/png', 'image/jpeg', 'image/webp', 'image/gif'], 'PNG, JPEG, WebP or GIF only.')
    .nullish(),
  title: z.string().trim().max(70),
  description: z.string().trim().max(200),
  author: z.string().trim().max(50),
  twitter: z.string()
    .trim()
    .regex(/^@?\w{0,15}$/, 'Up to 15 letters, numbers or underscores.'),
  imageAlt: z.string().trim().max(420),
})

type Schema = z.output<typeof schema>

const state = reactive<z.input<typeof schema>>({
  text: '',
  image: null,
  title: '',
  description: '',
  author: '',
  twitter: '',
  imageAlt: '',
})

const wireFields = ['title', 'description', 'author', 'twitter', 'imageAlt']
const wire = ref<string>()
const toast = useToast()

const preview = computed(() => ({
  title: state.title.trim() || truncate(state.text.trim(), 70) || 'Your headline here',
  description: state.description.trim() || truncate(state.text.trim(), 200) || 'Your story, as it will appear on share cards.',
}))

const onSubmit = async ({ data }: FormSubmitEvent<Schema>) => {
  const body = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (key === 'imageAlt' && !data.image) continue
    if (value) body.append(key, value)
  }

  try {
    const lie = await $fetch<Lie>('/api/lie', { method: 'POST', body })
    await navigateTo(`/l/${lie.id}`)
  }
  catch {
    toast.add({ title: 'The presses jammed. Try again.', color: 'error' })
  }
}

const onError = ({ errors }: FormErrorEvent) => {
  if (errors.some(error => error.name && wireFields.includes(error.name))) wire.value = 'meta'
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-3"
    @submit.prevent="onSubmit"
    @error="onError"
  >
    <div class="pb-3 text-center border-b border-default">
      <p class="text-xs uppercase tracking-[0.3em] text-primary">
        The Newsroom
      </p>
      <h1 class="font-headline text-4xl font-black text-highlighted">
        File Your Story
      </h1>
      <p class="italic text-muted">
        Unverified, unsourced, and on tomorrow’s front page.
      </p>
    </div>

    <UFormField name="text">
      <UTextarea
        v-model="state.text"
        placeholder="File your story..."
        :maxlength="1024"
        autoresize
        class="w-full"
      />
    </UFormField>
    <UFormField name="image">
      <UFileUpload
        v-model="state.image"
        accept="image/png,image/jpeg,image/webp,image/gif"
        label="Attach a photograph"
        description="For the front page. PNG, JPEG, WebP or GIF, up to 5MB"
        class="w-full min-h-32"
      />
    </UFormField>

    <UAccordion
      v-model="wire"
      :items="[{ label: 'Wire details', icon: 'i-lucide-newspaper', value: 'meta', slot: 'meta' as const }]"
      :ui="{ trigger: 'text-xs uppercase tracking-widest' }"
    >
      <template #meta-body>
        <div class="grid gap-3 sm:grid-cols-2">
          <UFormField
            name="title"
            label="Headline"
            :hint="`${state.title.length}/70`"
            class="sm:col-span-2"
          >
            <UInput
              v-model="state.title"
              :maxlength="70"
              :placeholder="truncate(state.text, 70) || 'Defaults to the start of your story'"
              class="w-full"
            />
          </UFormField>
          <UFormField
            name="description"
            label="Standfirst"
            description="The summary shown under the headline on share cards."
            :hint="`${state.description.length}/200`"
            class="sm:col-span-2"
          >
            <UTextarea
              v-model="state.description"
              :maxlength="200"
              :rows="2"
              autoresize
              :placeholder="truncate(state.text, 200) || 'Defaults to your story'"
              class="w-full"
            />
          </UFormField>
          <UFormField
            name="author"
            label="Byline"
          >
            <UInput
              v-model="state.author"
              :maxlength="50"
              placeholder="An Anonymous Source"
              class="w-full"
            />
          </UFormField>
          <UFormField
            name="twitter"
            label="Twitter handle"
          >
            <UInput
              v-model="state.twitter"
              :maxlength="16"
              placeholder="@handle"
              class="w-full"
            />
          </UFormField>
          <UFormField
            v-if="state.image"
            name="imageAlt"
            label="Photo caption"
            description="Also used as the image alt text."
            class="sm:col-span-2"
          >
            <UInput
              v-model="state.imageAlt"
              :maxlength="420"
              placeholder="Photograph obtained by The Shrlie Times."
              class="w-full"
            />
          </UFormField>
          <div class="sm:col-span-2 space-y-1.5">
            <p class="text-sm font-medium text-default">
              Share preview
            </p>
            <SharePreview
              :title="preview.title"
              :description="preview.description"
              :image="state.image"
              :image-alt="state.imageAlt"
            />
          </div>
        </div>
      </template>
    </UAccordion>

    <UButton
      type="submit"
      label="Go to Press"
      loading-auto
    />
  </UForm>
</template>
