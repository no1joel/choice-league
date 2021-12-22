<template>
  <div class="grid grid-cols-versus gap-2 place-items-center h-full">
    <div class="absolute top-0 right-0 text-sm text-gray-200">
      {{ matchupIndex + 1 }}/{{ matchupCount }}
      <span v-if="roundCount > 0"
        >(Round {{ roundIndex + 1 }}/{{ roundCount }})</span
      >
    </div>
    <ChoiceOption :choice="firstChoice" @select="onDecision(firstChoice)" />
    <span class="text-gray-800 text-xl italic font-thin">vs</span>
    <ChoiceOption :choice="secondChoice" @select="onDecision(secondChoice)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    firstChoice: {
      type: String,
      required: true,
    },
    secondChoice: {
      type: String,
      required: true,
    },
    roundCount: {
      type: Number,
      required: true,
    },
    roundIndex: {
      type: Number,
      required: true,
    },
    matchupCount: {
      type: Number,
      required: true,
    },
    matchupIndex: {
      type: Number,
      required: true,
    },
  },
  methods: {
    onDecision(choice: string) {
      this.$emit('decision-made', choice)
    },
  },
})
</script>
