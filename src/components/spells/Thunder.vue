



<script setup>
import { onMounted, ref, toValue, watch } from 'vue';

import { field_height,OnCollisionWithEnemy,usePositionStyle,OnPierceDepleated,onReachedEnd ,afterOneSecond,afterHalfSecond,afterTenthSecond} from '../../EntityComposables';
import useSpellData from './useSpellData';
import  * as AllSpells from "./spells"

const emit = defineEmits(["disappear","spawn-spell"])

const  props  = defineProps({
  tick: Number,
  enemiesOnFieldRefs: Array,
  initial_x: Number,
  initial_y: Number,
  id: String,
  pierce:Number,

  spawnedByAnotherSpell:{
    type:Boolean,
    default:false
  }
});

const spellData = useSpellData.getThunderData(props)
const position_x = props.initial_x
let position_y = 0

if (props.spawnedByAnotherSpell) {
  spellData.pierce = ref(props.pierce)
  position_y = props.initial_y
}

onMounted(()=>{
  spawnAnotherThunder()
  startDisappearing()
})

const styleObject = usePositionStyle(position_x,position_y,spellData.hitbox_width,spellData.hitbox_height)
const disappearing = ref(false)

OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  enemyRef.getHit( toValue(spellData.damage) )
  spellData.pierce.value--
})

OnPierceDepleated(spellData.pierce,()=>{
  emit('disappear', props);
})

function spawnAnotherThunder() {
  const nextSpawnPosition_y = position_y + spellData.hitbox_height
  if (nextSpawnPosition_y > field_height) return
  afterTenthSecond(props,()=>{
      emit('spawn-spell',{
      componentName:"Thunder",
      initial_x:position_x,
      initial_y:nextSpawnPosition_y,
      pierce:spellData.pierce
    })
  }) 
}

function startDisappearing() {
  afterHalfSecond(props,()=>{
    disappearing.value = true
    afterTenthSecond(props,()=>{
      emit("disappear", props)
    })
  })


}
</script>


<template>
  <div

  :style="styleObject"
  :class="{
    'disappearing':disappearing ,
    'spell absolute border-2 border-amber-400 text-amber-300':true}"
  >
      {{spellData.componentName[0]}} <br>
  </div>
</template>

<style scoped>
.spell{
  transition: opacity ease-in-out 100ms;

}
.disappearing{
  opacity: 0;
}
</style>