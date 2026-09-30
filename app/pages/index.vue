<script setup lang="ts">
const text = ref('')
const image = ref<File | null>(null)
const loading = ref(false)
const toast = useToast()

const submit = async () => {
  const body = new FormData()
  body.append('text', text.value)
  if (image.value) body.append('image', image.value)

  loading.value = true
  try {
    const lie = await $fetch<Lie>('/api/lie', { method: 'POST', body })
    await navigateTo(`/l/${lie.id}`)
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
  <form
    class="space-y-3"
    @submit.prevent="submit"
  >
    <UTextarea
      v-model="text"
      placeholder="Tell a lie..."
      :maxlength="1024"
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
</template>
