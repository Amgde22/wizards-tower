<script setup>
import uniqid from "uniqid"
import { computed, onMounted, ref, toValue, watch, watchEffect } from "vue";
import {usePositionStyle ,useMovementManager,useSpawnFlying, useEnemy,onReachedBase,useMakeEnemyAbsorbPierce} from "@/EntityComposables"
import bat from "assets/bat.svg"
import heart from "assets/heart.svg"
import shield from "assets/shield.svg"


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
    name: "Bat",
    isGrounded:false,
    health: ref(5),
    movementSpeed: ref(6),
    damage: ref(10),
 
    entityId: ref(props.id),  
    initial_x:props.initial_x,
    initial_y:props.initial_y,
    hitbox_width: 120,
    hitbox_height: 120,

    emit,
  }

const enemy = useEnemy(props,{...enemyData})
const {position_x,position_y} = useMovementManager(props,useSpawnFlying,enemy,enemyData)

const styleObject = usePositionStyle(position_x,position_y,enemyData.hitbox_width, enemyData.hitbox_height)

useMakeEnemyAbsorbPierce(props,enemy,enemyData)

onReachedBase(position_x,()=>{
  enemy.die()
  emit("arrived" , toValue(enemyData.damage))
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
    class="enemy
    absolute grid place-items-center border-2 border-slate-500">
    <div class="enemy-health-container">
      <img v-for="n in enemyData.health.value" :key="n" :src="heart" alt="Heart">
    </div>
    <img class="shield" :src="shield" alt="">
    <img class="icon-lg" :src="bat" alt="">  

  </div>

</template>


<style lang="scss" scoped>

</style>