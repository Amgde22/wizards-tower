<template>
    <div 
      :class="props.selectedSpell?.placeSection" 
      class="spell-placer z-10"
      @dragover="dragOverHandle"
      @drop="handleDrop"
      @pointermove="mouseMoveHandler"
      @pointerenter="showSelector"
      @pointerleave="hideSelector"
      @click="handleClick"
      >
      <SpellSelector v-if="props.selectedSpell"
        class="pointer-events-none"  
        :style="spellSelectorStyles" :isDraggable="false" 
        :spellName="selectedSpell.componentName"
        @setWidthAndHight="setWidthAndHight($event)"
      />
      
    </div>

</template>

<script setup>
import { computed, ref, toValue } from "vue";
import SpellSelector from "./SpellSelector.vue";

const emit = defineEmits(["spellPlaced","spellCooldownOver"])
const props = defineProps({
  selectedSpell:[Object,null],
  isDraggingSpell:Boolean
})

const spellSelectorStyles= ref({
  opacity:"0",
  position:"absolute",
  top:"0px",
  left:"0px"
})
const halfSpellWidth = ref(null)
const halfSpellHeight = ref(null)

function dragOverHandle(e) {
  e.preventDefault()
}

function handleDrop(e) {
  placeSpell(e.layerX,e.layerY)
}
function handleClick(e) {
  placeSpell(e.layerX - halfSpellWidth.value,e.layerY - halfSpellHeight.value)
}
function showSelector() {
  spellSelectorStyles.value.opacity = "1"
}
function hideSelector() {
  spellSelectorStyles.value.opacity = "0"
  
}
function mouseMoveHandler(e) {
  spellSelectorStyles.value.top = e.layerY - halfSpellHeight.value  + "px"
  spellSelectorStyles.value.left = e.layerX  - halfSpellWidth.value + "px"
}

function placeSpell(initial_x,initial_y){
  const placeCoordinates = {
    initial_x,
    initial_y
  }


  emit('spellPlaced',placeCoordinates)
}


function setWidthAndHight({width,height}) {
  halfSpellWidth.value = toValue(width) /2
  halfSpellHeight.value = toValue(height) / 2
}

</script>

<style  scoped>
.spell-placer{
  display: none;
  cursor: pointer;
  background-color: rgba(107, 114, 128, 0.5);

}
.spell-placer.top {
  display: block;
  grid-area: 1/a/2/h;
}
.spell-placer.left {
  display: block;
  grid-area: 1/a/5/a;
}
.spell-placer.bottom {
  display: block;
  grid-area: 4/a/5/h;
}
.spell-placer.whole {
  display: block;
  grid-area: 1/a/5/h;
}
</style>