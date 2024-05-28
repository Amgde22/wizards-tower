


<script setup>
import { ref, watch ,toValue} from 'vue';

import { useMoveToRight,OnCollisionWithEnemy,usePositionStyle,OnPierceDepleated,onReachedEnd } from '../../EntityComposables';
import useSpellData from './useSpellData';
const emit = defineEmits(["disappear"])
const  props  = defineProps({
  tick: Number,
  enemiesOnFieldRefs: Array,
  initial_x: Number,
  initial_y: Number,
  id: String,
});



const spellData = useSpellData.getFireballData(props)


const position_x = useMoveToRight(props,true,{
  movementSpeed:spellData.movementSpeed,
  initial_x:props.initial_x
})
const position_y = ref(props.initial_y)



const styleObject = usePositionStyle(position_x,position_y,spellData.hitbox_width,spellData.hitbox_height)

watch(props ,()=>{

})

OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  enemyRef.getHit( toValue(spellData.damage) )
  spellData.pierce.value--
})

onReachedEnd({position_x,...spellData},()=>{
  emit('disappear', props);
})
OnPierceDepleated(spellData.pierce,()=>{
  emit('disappear', props);
})

</script>



<template>
  <div
  :style="styleObject"
  class="spell
  absolute border-2 border-amber-600 text-amber-600">
      {{spellData.componentName}} <br>
  </div>
</template>

