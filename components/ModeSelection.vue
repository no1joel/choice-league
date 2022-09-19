<template>
  <div class="h-full w-full">
    <h2 class="text-xl font-bold">Select the mode</h2>
    <label v-for="mode in modes" :key="mode" class="block text-lg">
      <input
        :id="`mode-select-${mode}`"
        v-model="selectedMode"
        type="radio"
        name="mode-selection"
        :value="mode"
      />
      {{ mode }}
    </label>
    <button
      class="mt-4 block w-full border border-green-500 bg-green-400 text-green-900 p-2 rounded flex-1 text-xl hover:bg-green-200 hover:text-green-500 transition duration-300"
      @click="onNextClick"
    >
      Next
    </button>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
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
})
</script>
