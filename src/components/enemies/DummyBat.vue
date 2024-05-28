<template>
  <div>
    <h1>{{x}}</h1>
    <br>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import useSome from "./useSome"
const props = defineProps(["tick"])
const x=ref(0)
const unwatch = watch(props, ()=>{
  x.value++
  if (x.value >= 10) {unwatch()}
})




</script>

<style lang="scss" scoped>

</style>