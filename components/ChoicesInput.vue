<template>
  <div class="flex h-screen w-screen">
    <textarea
      v-model="choicesStr"
      :rows="choiceCount + 1"
      class="border border-gray-200 flex-1 text-2xl"
    />
    <button
      :disabled="!allowNext"
      class="
        border border-green-500
        bg-green-400
        text-gray-100
        p-1.5
        px-3
        rounded
        flex-1
        text-7xl
      "
      @click="onNextClick"
    >
      Next
    </button>
  </div>
</template>

<script lang="ts">
export default {
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
}
</script>
