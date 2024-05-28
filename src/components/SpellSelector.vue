<template>
  <div class="spell-selector-container">
    <div 
    ref="selectorRef"
      class="spell-selector grid place-items-center z-20" 
      :style="spellSelectorStyles"
      :draggable="props.isDraggable"
      @click="clickHandler"
      @dragstart="dragStartHandler"
      @dragend="dragEndHandler"
      >
        <!-- first letter of spell untill we get icons -->
          {{ spellData?.componentName[0] }}  <br>
    </div>
    <div 
    v-if="props.cooldown != undefined" 
    :style="cooldownBarStyles"
    class="cooldown-bar"></div>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect,computed, onMounted } from 'vue';
import useSpellData from './spells/useSpellData';

const emit = defineEmits(["spell-selected","spell-deselected","dragging-started","dragging-ended","setWidthAndHight"])
const props = defineProps({

  spellName:{
    type:String,
  },
  cooldown:{
    type:Number
  },
  selectedSpell:{
    type:[Object,null],
    default:null
  },

  isDraggable:{
    type:Boolean,
    default:true
  },
  positionStyles:{
    type:Object,
    default:{}
  }
})


// reactive data (weird but it works) (don't put into function)
let spellData = null
if (props.spellName != undefined) {
    const dataFunctionName = "get" + props.spellName + "Data"
  if (useSpellData[dataFunctionName] == undefined) {
    console.warn("could find spell data in useSpellData of:",props.spellName);
  }
  spellData = useSpellData[dataFunctionName]()
}

const isSelected = ref(false)
const selectorRef = ref(null)
const cooldownRatio = computed(()=>1  - (props.cooldown / spellData.cooldown))



// events
onMounted(()=>{
  // for parent component to set spell height and width
  emit("setWidthAndHight" , {
  width: spellData.hitbox_width,
  height: spellData.hitbox_height
  })
})




// watchers
watch(()=>props.selectedSpell, ()=>{
  if (props.selectedSpell != null && props.selectedSpell.componentName == spellData.componentName) {
    isSelected.value = true
  }
  else{
    isSelected.value = false

  }
})


// computed styles
const spellSelectorStyles = computed(() => {
  return {
    width: props.isDraggable? undefined :(spellData.hitbox_width + "px") ,
    height: props.isDraggable? undefined :(spellData.hitbox_height + "px") ,

    opacity:isSelected.value?"0.5":"1",
    border:`2px solid ${spellData.color}`,
    ...props.positionStyles
  }
})

const cooldownBarStyles = computed(()=>{
  return{
    backgroundColor:spellData.color,
    transform:`scaleY(${cooldownRatio.value})`
  }
})



// event handlers
function clickHandler(params) {
  emit('spell-selected',spellData)
}
function dragStartHandler(e) {
  e.dataTransfer.setDragImage(selectorRef.value, 0, 0);
  emit('spell-selected',spellData);
  emit('dragging-started')
}
function dragEndHandler(e) {
  emit('spell-deselected',spellData);
  emit('dragging-ended')
}

</script>

<style  scoped>
.spell-selector-container{
  position: relative;

  height: min-content;
}
.spell-selector{
  user-select: none;
  cursor: pointer;
  width: 70px;
  height: 70px;

  z-index: 5;
}
.cooldown{
  position: absolute;
  inset: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.325);
}

.cooldown-bar{
  position: absolute;
  inset:0;
  background-color: gray;
  opacity: 0.4;

  transform-origin: bottom;
  transition: transform 150ms ease-out;
  z-index: -1;

}
</style>