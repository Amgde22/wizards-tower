<template>
  <div class="absolute inset-0 grid place-items-center">

    <p 
    :class="{
      'fading':isAnimating
    }" 
    class="header">
      level {{ level }} {{ levelStatus }}
    </p>
  </div>

</template>

<script setup>
import { computed, ref, watch } from 'vue';
const props = defineProps({
  levelIsFinished:Boolean,
  level:Number
})
const level = ref(props.level - 1)
const levelStatus = computed(()=>props.levelIsFinished?"completed":"started")
const isAnimating = ref(false)
watch(()=>props.levelIsFinished , (newVal , oldVal)=>{

  if (newVal == false && oldVal == true) {
    level.value++
  }
  isAnimating.value = true
  setTimeout(() => {
  isAnimating.value = false
  }, 1500);
})
</script>

<style scoped>
.header{
font-size: 40px;
opacity: 0;

}
.fading{
  animation: fade 1500ms linear;
  transition: all;
}
@keyframes fade {
  0% {
    opacity: 0;
    transform: translateY(0px);

  }
  50% {
    opacity: 1;
    transform: translateY(0px);
  }
  75% {
    opacity: 1;
    transform: translateY(0px);
  }
  100% {
    opacity: 0;
    transform: translateY(-2.25em);
  }
}
</style>
