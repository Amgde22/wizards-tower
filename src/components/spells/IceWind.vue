<script setup>
import { ref, watch ,toValue} from 'vue';

import { useMoveToRight,OnCollisionWithEnemy,usePositionStyle,OnPierceDepleated,onReachedEnd } from '../../EntityComposables';
import useSpellData from './useSpellData';
import snowFlakeIcon from "assets/snowflake.svg"
const emit = defineEmits(["disappear","spawn-spell"])
const  props  = defineProps({
  tick: Number,
  enemiesOnFieldRefs: Array,
  initial_x: Number,
  initial_y: Number,
  id: String,
});



const spellData = useSpellData.getIceWindData(props)


const position_x = useMoveToRight(props,true,{
  movementSpeed:spellData.movementSpeed,
  initial_x:props.initial_x
})
const position_y = ref(props.initial_y)



const styleObject = usePositionStyle(position_x,position_y,spellData.hitbox_width,spellData.hitbox_height)

watch(props ,()=>{

})

OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  if (spellData.pierce.value <= 0) return

  enemyRef.getHit( toValue(spellData.damage) )
  enemyRef.getFrozen(8)
  spellData.pierce.value--


  emit('spawn-spell',{
      componentName:"IceBlock",
      followedEnemyEnemyref:enemyRef,
      initial_x:0,
      initial_y:0,
    })
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
  absolute border-2 border-blue-300  text-blue-600">
    <img class="icon" :src="snowFlakeIcon" > <br>
  </div>
</template>

