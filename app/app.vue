<script setup lang="ts">
useHead({
  title: 'shrlie',
  meta: [{ name: 'description', content: 'Share a lie' }],
})

const text = ref('')
const image = ref<File | null>(null)
const loading = ref(false)
type Lie = { id: string, text: string, image: string | null }

const lie = ref<Lie | null>(null)
const toast = useToast()

const submit = async () => {
  const body = new FormData()
  body.append('text', text.value)
  if (image.value) body.append('image', image.value)

  loading.value = true
  try {
    lie.value = await $fetch<Lie>('/api/lie', { method: 'POST', body })
    text.value = ''
    image.value = null
  }
  catch {
    toast.add({ title: 'Could not create lie', color: 'error' })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UApp>
    <UContainer class="max-w-xl py-16 space-y-6">
      <h1 class="text-3xl font-bold">
        shrlie
      </h1>

      <form
        class="space-y-3"
        @submit.prevent="submit"
      >
        <UTextarea
          v-model="text"
          placeholder="Tell a lie..."
          :maxlength="1000"
          autoresize
          class="w-full"
        />
        <UFileUpload
          v-model="image"
          accept="image/png,image/jpeg,image/webp,image/gif"
          label="Add an image"
          description="PNG, JPEG, WebP or GIF, up to 5MB"
          class="w-full min-h-32"
        />
        <UButton
          type="submit"
          label="Create"
          :loading="loading"
          :disabled="!text.trim()"
        />
      </form>

      <UCard v-if="lie">
        <p>{{ lie.text }}</p>
        <img
          v-if="lie.image"
          :src="`/api/lie/${lie.id}/image`"
          :alt="lie.text"
          class="mt-3 rounded-md max-h-96"
        >
      </UCard>
    </UContainer>
  </UApp>
</template>
