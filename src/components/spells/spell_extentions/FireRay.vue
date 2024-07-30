<script setup>
import { ref, watch ,toValue, onMounted, computed} from 'vue';
import { useMoveToRight,OnCollisionWithEnemy,usePositionStyle,OnPierceDepleated,onReachedEnd } from '@/EntityComposables';
import useSpellData from '@/components/spells/useSpellData';
import fireIcon from "assets/fire-ray.svg";


const emit = defineEmits(["disappear"])
const  props  = defineProps({
  tick: Number,
  enemiesOnFieldRefs: Array,
  initial_x: Number,
  initial_y: Number,
  id: String,
  angle:{
    Type:Number,
    default:0
  }
});



const spellData = useSpellData.getFireRaysData(props)
spellData.hitbox_height = 40

const position_x = useMoveToRight(props,true,{
  movementSpeed:spellData.movementSpeed,
  initial_x:props.initial_x
})

const {initial_x ,initial_y} = props
const angle = props.angle // -15
const position_y = computed(()=>{
  const radians = (angle * Math.PI) / 180;
  const newY = initial_y + toValue(position_x) * Math.sin(radians);
  return newY
})

const styleObject = usePositionStyle(position_x,position_y,spellData.hitbox_width,spellData.hitbox_height)


OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  if (spellData.pierce.value <= 0) return
  enemyRef.getKnockedBack(100)
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
  </div>
</template>