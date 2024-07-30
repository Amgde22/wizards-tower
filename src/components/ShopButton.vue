<template>
  <div @click="buy" class="buy-container flex cursor-pointer ">
    <button 
      class="border-2 uppercase" 
      :class="{
        'bg-blue-700 border-blue-900': varient === 'blue',
        'bg-blue-800 border-blue-900': varient === 'dark-blue',
        'bg-red-700 border-red-900': varient === 'red',
        'bg-red-800 border-red-900': varient === 'dark-red',
      }"
    >
      <slot />
      <span v-if="scalingPrice">({{ toRoman(bonus_level) }})</span>
    </button>

    <span class="py-1 px-2 border-2 border-amber-400 flex items-end">
      {{ current_price }} 
      <img :src="coinsSrc" class="icon" alt="">
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import coinsSrc from "assets/coins.svg"

const emit = defineEmits(["bought"])
const props = defineProps({
  money: {
    type: Number,
    required: true
  },
  varient: {
    type: String,
    default: "blue"
  },
  basePrice: {
    type: Number,
    default: 250
  },
  scalingPrice:{
    type:Boolean,
    default:true
  }
})

const bonus_level = ref(0)
const current_price = computed(() => props.basePrice + bonus_level.value * props.basePrice / 2)

function buy() {
  if (props.money < current_price.value) return
  emit("bought", current_price.value)

  if (props.scalingPrice == true) {
    bonus_level.value++
  }
  
}

function toRoman(num) {
  const romanNumerals = [
     "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"
  ];
  return romanNumerals[num] || num.toString();
}
</script>

<style scoped>
.buy-container{
  font-size: 0.9em;
}
</style>
