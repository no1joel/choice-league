<template>
  <div class="grid md:grid-cols-versus gap-2 place-items-center md:h-full">
    <div class="absolute top-0 right-0 text-sm text-gray-200">
      {{ choicesLeft }}
    </div>
    <ChoiceOption :choice="firstChoice" @select="onDecision(firstChoice)" />
    <span class="text-gray-800 text-xl italic font-thin">vs</span>
    <ChoiceOption :choice="secondChoice" @select="onDecision(secondChoice)" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Choice } from '../utils/Choice'

export default Vue.extend({
  props: {
    choicesLeft: {
      type: Number,
      required: true,
    },
    firstChoice: {
      type: Object as PropType<Choice>,
      required: true,
    },
    secondChoice: {
      type: Object as PropType<Choice>,
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
    onDecision(choice: Choice) {
      this.$emit('decision-made', choice)
    },
  },
})
</script>
