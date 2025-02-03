<template>
    <img
      :src="imageUrl"
      :alt="alt"
      @error="handleError"
      v-bind="$attrs"
      class="object-cover"
    />
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { getImageUrl, handleImageError } from './../utils/images'
  
  const props = defineProps<{
    src?: string
    alt: string
    type?: 'product' | 'profile' | 'category' | 'banner'
  }>()
  
  const imageUrl = computed(() => getImageUrl(props.src, props.type))
  
  const handleError = (event: Event) => {
    handleImageError(event, props.type)
  }
  </script>