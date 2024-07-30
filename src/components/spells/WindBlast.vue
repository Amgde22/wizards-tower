<script setup>
import { ref, watch ,toValue, onMounted} from 'vue';
import { useMoveToRight,OnCollisionWithEnemy,usePositionStyle,OnPierceDepleated,onReachedEnd } from '@/EntityComposables';
import useSpellData from './useSpellData';
import wbIcon from "assets/wind-hole.svg";
import { afterFixthSecond } from '../../EntityComposables';


const emit = defineEmits(["disappear"])
const  props  = defineProps({
  tick: Number,
  enemiesOnFieldRefs: Array,
  initial_x: Number,
  initial_y: Number,
  id: String,
});



const spellData = useSpellData.getWindBlastData(props)

const position_x = useMoveToRight(props,true,{
  movementSpeed:spellData.movementSpeed,
  initial_x:props.initial_x
})
const position_y = ref(props.initial_y)



const styleObject = usePositionStyle(position_x,position_y,spellData.hitbox_width,spellData.hitbox_height)


OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  enemyRef.getKnockedBack(220)
  spellData.pierce.value--
})

onReachedEnd({position_x,...spellData},()=>{
  emit('disappear', props);
})
OnPierceDepleated(spellData.pierce,()=>{
  afterFixthSecond(props,()=>{
    emit('disappear', props);
  })
})

</script>



<template>
  <div
  :style="styleObject"
  class="spell
  absolute border-2 border-green-500 text-green-500">
  <img class="icon-lg" :src="wbIcon" alt=""><br>
  </div>
</template>