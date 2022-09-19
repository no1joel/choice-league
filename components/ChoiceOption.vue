<template>
  <div class="w-full h-full grid grid-auto-rows-2 gap-2 justify-items-stretch">
    <div class="flex items-center text-center self-end relative">
      <div class="flex-1 text-5xl">{{ choice.value }}</div>
      <img v-if="choice.imgSrc" :src="choice.imgSrc" />
      <button
        class="absolute top-0 right-0 text-gray-400 text-sm"
        @click="onCopyClick"
      >
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <div class="flex items-center text-center self-start">
      <button
        :class="[
          'flex-1',
          'transition',
          'duration-300',
          'text-blue-900',
          'bg-blue-500',
          'border-blue-800',
          'border',
          'p-2',
          'text-3xl',
          'rounded-xl',
          'hover:bg-blue-300',
          'hover:border-blue-600',
          'hover:shadow-lg',
        ]"
        @click="$emit('select')"
      >
        Select
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Choice } from '~/utils/Choice'

export default Vue.extend({
  props: {
    choice: {
      type: Object as PropType<Choice>,
      required: true,
    },
  },
  data() {
    return { copied: false }
  },
  methods: {
    onCopyClick() {
      navigator.clipboard.writeText(this.choice.value)
      this.copied = true
      setTimeout(() => (this.copied = false), 3000)
    },
  },
})
</script>
