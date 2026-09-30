<script setup lang="ts">
useHead({
  title: 'shrlie',
  meta: [{ name: 'description', content: 'Share a lie' }],
})

const text = ref('')
const loading = ref(false)
const lie = ref<{ id: string, text: string } | null>(null)
const toast = useToast()

const submit = async () => {
  loading.value = true
  try {
    lie.value = await $fetch('/api/lie', {
      method: 'POST',
      body: { text: text.value },
    })
    text.value = ''
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
        <UButton
          type="submit"
          label="Create"
          :loading="loading"
          :disabled="!text.trim()"
        />
      </form>

      <UAlert
        v-if="lie"
        color="success"
        variant="subtle"
        title="Lie created"
        :description="lie.text"
      />
    </UContainer>
  </UApp>
</template>
