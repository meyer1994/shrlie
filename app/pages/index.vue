<script setup lang="ts">
const text = ref('')
const image = ref<File | null>(null)
const meta = reactive({
  title: '',
  description: '',
  author: '',
  twitter: '',
  imageAlt: '',
})
const loading = ref(false)
const toast = useToast()

const truncate = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value

const submit = async () => {
  const body = new FormData()
  body.append('text', text.value)
  if (image.value) body.append('image', image.value)
  for (const [key, value] of Object.entries(meta)) {
    if (key === 'imageAlt' && !image.value) continue
    if (value.trim()) body.append(key, value)
  }

  loading.value = true
  try {
    const lie = await $fetch<Lie>('/api/lie', { method: 'POST', body })
    await navigateTo(`/l/${lie.id}`)
  }
  catch {
    toast.add({ title: 'The presses jammed. Try again.', color: 'error' })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <form
    class="space-y-3"
    @submit.prevent="submit"
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

    <UTextarea
      v-model="text"
      placeholder="File your story..."
      :maxlength="1024"
      autoresize
      class="w-full"
    />
    <UFileUpload
      v-model="image"
      accept="image/png,image/jpeg,image/webp,image/gif"
      label="Attach a photograph"
      description="For the front page. PNG, JPEG, WebP or GIF, up to 5MB"
      class="w-full min-h-32"
    />

    <UAccordion
      :items="[{ label: 'Wire details', icon: 'i-lucide-newspaper', slot: 'meta' as const }]"
      :ui="{ trigger: 'text-xs uppercase tracking-widest' }"
    >
      <template #meta-body>
        <div class="grid gap-3 sm:grid-cols-2">
          <UFormField
            label="Headline"
            :hint="`${meta.title.length}/70`"
            class="sm:col-span-2"
          >
            <UInput
              v-model="meta.title"
              :maxlength="70"
              :placeholder="truncate(text, 70) || 'Defaults to the start of your story'"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Standfirst"
            description="The summary shown under the headline on share cards."
            :hint="`${meta.description.length}/200`"
            class="sm:col-span-2"
          >
            <UTextarea
              v-model="meta.description"
              :maxlength="200"
              :rows="2"
              autoresize
              :placeholder="truncate(text, 200) || 'Defaults to your story'"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Byline">
            <UInput
              v-model="meta.author"
              :maxlength="50"
              placeholder="An Anonymous Source"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Twitter handle">
            <UInput
              v-model="meta.twitter"
              :maxlength="16"
              placeholder="@handle"
              class="w-full"
            />
          </UFormField>
          <UFormField
            v-if="image"
            label="Photo caption"
            description="Also used as the image alt text."
            class="sm:col-span-2"
          >
            <UInput
              v-model="meta.imageAlt"
              :maxlength="420"
              placeholder="Photograph obtained by The Shrlie Times."
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
    </UAccordion>

    <UButton
      type="submit"
      label="Go to Press"
      :loading="loading"
      :disabled="!text.trim()"
    />
  </form>
</template>
