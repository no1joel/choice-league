<template>
  <div class="flex h-full w-full">
    <textarea
      v-model="choicesStr"
      :rows="choiceCount + 1"
      class="border border-gray-200 flex-1 text-2xl"
      placeholder="Enter contestants here
one
per
line"
    />
    <button
      :disabled="!allowNext"
      :class="[
        'border',
        'p-1.5',
        'px-3',
        'rounded',
        'flex-1',
        'text-7xl',
        'duration-1000',
        {
          'bg-green-400 text-green-900 hover:bg-green-200 hover:text-green-500 duration-300':
            allowNext,
          'bg-gray-200 text-gray-300 cursor-not-allowed': !allowNext,
        },
        'transition',
      ]"
      @click="onNextClick"
    >
      {{ allowNext ? 'Start' : 'Enter at least 2 contestants' }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      choicesStr: '',
    }
  },
  computed: {
    choiceCount(): number {
      return this.choices.length
    },
    choices(): string[] {
      return this.choicesStr
        .split('\n')
        .filter((choice) => choice.trim().length > 0)
    },
    allowNext(): boolean {
      return this.choiceCount > 1
    },
  },
  methods: {
    onNextClick() {
      if (!this.allowNext) {
        return
      }
      this.$emit('choices-entered', this.choices)
    },
  },
})
</script>
