<template>
  <div class="grid grid-cols-versus gap-2 place-items-center h-screen">
    <ChoiceOption :choice="firstChoice" @select="onDecision(firstChoice)" />
    <span class="text-gray-800 text-xl italic font-thin">vs</span>
    <ChoiceOption :choice="secondChoice" @select="onDecision(secondChoice)" />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    firstChoice: {
      type: String,
      required: true,
    },
    secondChoice: {
      type: String,
      required: true,
    },
  },
  methods: {
    onDecision(choice: string) {
      this.$emit('decision-made', choice)
    },
  },
}
</script>
