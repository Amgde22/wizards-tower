<script setup>
import uniqid from "uniqid"
import { computed, onMounted, ref, toValue, watch, watchEffect } from "vue";
import {usePositionStyle ,useMovementManager,useSpawnFlying, useEnemy,onReachedBase,onGetHit,onDie} from "../../EntityComposables"
import bat from "assets/bat.svg"
import heart from "assets/heart.svg"

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
    health: ref(2),
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

const styleObject = usePositionStyle(position_x,position_y,enemyData.hitbox_width, enemyData.hitbox_height,enemy.isFlashing)


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
    class="enemy
    absolute grid place-items-center border-2 border-red-600">
    <div class="enemy-health-container">
      <img v-for="n in enemyData.health.value" :key="n" :src="heart" alt="Heart">
    </div>
    <img :src="bat" alt="">  
  </div>

</template>


<style lang="scss" scoped>

</style>