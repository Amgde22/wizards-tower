<script setup>
import { ref, watch ,toValue, onMounted} from 'vue';
import { useMoveToRight,OnCollisionWithEnemy,usePositionStyle,OnPierceDepleated,onReachedEnd } from '@/EntityComposables';
import useSpellData from './useSpellData';
import fireIcon from "assets/firebolt.svg";


const emit = defineEmits(["disappear","spawn-spell"])
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


OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  if (spellData.pierce.value <= 0) return

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
  <img class="icon" :src="fireIcon" alt=""><br>  
  <!-- <p>{{ spellData.pierce }}</p> -->
  </div>
</template>