<script setup>
import uniqid from "uniqid"
import { computed, onMounted, ref, toValue, watch, watchEffect } from "vue";
import {usePositionStyle ,useMovementManager,useSpawnFlying, useEnemy,onReachedBase,onGetHit,onDie} from "../../EntityComposables"


const emit = defineEmits(["enemyDied","arrived"])

const props = defineProps({
  tick:{
    type:Number,
    required:true
  },
  id: {
    type: String,
    required:true
  },
  initial_x:Number,
  initial_y:Number,
})




const enemyData =
  {
    name: "Frozen Bat",
    isGrounded:false,
    health: ref(1),
    movementSpeed: ref(8),
    damage: ref(10),

    entityId: ref(props.id),  
    initial_x:props.initial_x,
    initial_y:props.initial_y,
    hitbox_width: 100,
    hitbox_height: 100,

    emit,
  }

const enemy = useEnemy(props,{...enemyData})
const {position_x,position_y} = useMovementManager(props,useSpawnFlying,enemy,enemyData)
const styleObject = usePositionStyle(position_x,position_y,enemyData.hitbox_width, enemyData.hitbox_height)
setTimeout(() => {
  enemy.getFrozen(3)
}, 500);


onReachedBase(position_x,()=>{
  emit("arrived" , toValue(enemyData.damage))
  enemy.die()
})
  defineExpose({
    position_x,
    position_y,
    ...enemyData,
    ...enemy
  })
</script>

<template>

  <div 
    :style="styleObject"
    class="enemy text-center
    absolute grid place-items-center border-2 border-blue-400">
    {{ enemyData.name }} <br>
    {{ Math.round( toValue( position_y ) )  }} <br>
    {{ enemy.isFrozen.value?"frozen":"not frozen" }}
  </div>

</template>


<style lang="scss" scoped>

</style>