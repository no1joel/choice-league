<template>
  <div class="flex h-screen w-screen">
    <div class="flex-1">
      <label v-for="mode in modes" :key="mode" class="block">
        <input
          :id="`mode-select-${mode}`"
          v-model="selectedMode"
          type="radio"
          name="mode-selection"
          :value="mode"
        />
        {{ mode }}
      </label>
    </div>
    <button
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

<script>
export default {
  props: {
    modes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedMode: this.modes[0],
    }
  },
  methods: {
    onNextClick() {
      this.$emit('selected', this.selectedMode)
    },
  },
}
</script>
