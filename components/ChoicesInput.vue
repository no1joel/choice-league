<template>
  <div class="sm:grid sm:grid-cols-2 gap-2 h-full w-full">
    <div>
      <textarea
        v-model="choicesStr"
        :rows="choiceCount + 1"
        class="border border-gray-200 text-xl md:text-2xl p-1 w-full h-full"
        placeholder="Enter contestants here
      one
      per
      line"
      />
    </div>
    <button
      :disabled="!allowNext"
      :class="[
        'block',
        'w-full',
        'border',
        'p-1.5',
        'px-3',
        'rounded',
        'text-xl',
        'md:text-5xl',
        'xl:text-7xl',
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
