<template>
  <div class="health-bar-container">
    <div class="health-bar-red bg-red-800" :style="redHealthStyles"></div>
    <div class="health-bar-yellow bg-amber-500" :style="yellowHealthStyles" ></div>
    <div class="health-bar-green bg-green-600" :style="greenHealthStyles" ></div>
    <span class="text-white absolute inset-0 text-center z-10 flex items-center justify-center">{{props.currentHealth}}/{{ props.maxHealth }}</span>
  </div>
</template>

<script setup>
// this component manages 3 seperate heath bars to display health
import { computed, ref, watch } from 'vue';

const props = defineProps({
  maxHealth:Number,
  currentHealth:Number,
})

const redHealthLength = ref(props.currentHealth)
const yellowHealthLength = ref(props.currentHealth)
const greenHealthLength = ref(props.currentHealth)

const redHealthStyles = computed(()=>{
  const redBar_to_MaxHealth_Ratio = redHealthLength.value / props.maxHealth
  return {
    transform:`scaleX(${redBar_to_MaxHealth_Ratio})`
  }
})
const yellowHealthStyles = computed(()=>{
  const yellowBar_to_MaxHealth_Ratio = yellowHealthLength.value / props.maxHealth
  return {
    transform:`scaleX(${yellowBar_to_MaxHealth_Ratio})`
  }
})
const greenHealthStyles = computed(()=>{
  const greenBar_to_MaxHealth_Ratio = greenHealthLength.value / props.maxHealth
  return {
    transform:`scaleX(${greenBar_to_MaxHealth_Ratio})`
  }
})


watch(()=> props.currentHealth , (newHealth_value , oldHealth_value)=>{



  if (newHealth_value < oldHealth_value) { // health got reduced
    displayReducedHealth(newHealth_value)
  }
  else { // health was increased
    displayIncreasedHealth(newHealth_value)
  }
})

function displayReducedHealth(newHealth_value) {
  redHealthLength.value = newHealth_value
  greenHealthLength.value = newHealth_value
  setTimeout(() => {
    yellowHealthLength.value = newHealth_value
  }, 400);
}

function displayIncreasedHealth(newHealth_value) {
  greenHealthLength.value = newHealth_value
  setTimeout(() => {
    redHealthLength.value = newHealth_value
    yellowHealthLength.value = newHealth_value
  }, 400);
}


</script>

<style  scoped>
.health-bar-container{
  position: relative; 
  width: 200px;
  height: 35px;
  display: flex;
  gap: 0;
  border: 2px solid white;
  isolation: isolate;
}
.health-bar-red,.health-bar-yellow ,.health-bar-green{
  left: 0;
  position: absolute;
  height: 100%;width: 100%;
  transition: transform 100ms ease-out;
  transform-origin: left;
}
.health-bar-red{
  z-index: 2;
}
.health-bar-yellow{
  z-index: 1;
}
.health-bar-green{
  z-index: 0;
}
</style>