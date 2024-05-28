<template>
  <div :class="{
    'mana-bar':true,
    'bg-red-800':containerFlashingActive
    }">
    <div class="mana-supply bg-blue-800 " :style="mana_supply_styles">
      <div class="mana-to-be-uses bg-blue-500" :style="mana_to_be_used_styles" ></div>
    </div>
    <span class="text-white absolute inset-0 text-center z-10">{{ props.manaToBeUsed?(props.manaSupply-props.manaToBeUsed):props.manaSupply   }}</span>
  </div>
</template>

<script setup>
// asume you dont
import { computed, ref } from 'vue';

const props = defineProps({
  manaCapacity:Number,
  manaSupply:Number,
  manaToBeUsed:[null , Number]
})


const containerFlashingActive = ref(false)
const mana_supply_styles = computed(()=>{
  const manaSupplyRatio = props.manaSupply / props.manaCapacity
  return{
    transform:`scaleX(${manaSupplyRatio})`
  }


})
const mana_to_be_used_styles = computed(()=>{
  // if no spell will be used , cancel showing mana-to-be used
  if (props.manaToBeUsed == null) return

    const manaToBeUsedRatio = props.manaToBeUsed / props.manaSupply
    if (props.manaToBeUsed > props.manaSupply ) {
      redFlash()
      return
    }
    return{
      transform:`scaleX(${manaToBeUsedRatio})`
    }
})

function redFlash() {
  containerFlashingActive.value =true

  setTimeout(() => {
    containerFlashingActive.value = false

  }, 400);
}

</script>

<style  scoped>
.mana-bar{
  position: relative;
  width: 200px;
  height: 35px;
  display: flex;
  gap: 0;
  border: 2px solid white;

  transition: background-color 150ms ease-in;
}
.mana-supply{
  left: 0;
  position: absolute;
  height: 100%;width: 100%;
  transform-origin: left;

  z-index: 1;
}
.mana-to-be-uses{
  right: 0;
  position: absolute;
  height: 100%;width: 100%;
  transform-origin: right;
  transform:scaleX(0);
  z-index: 2;

}
</style>