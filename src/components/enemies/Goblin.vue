<script setup>
import uniqid from "uniqid"
import { computed, onMounted, ref, toValue, watch, watchEffect } from "vue";
import {usePositionStyle ,useMovementManager,useSpawnGrounded,useEnemy,onReachedBase, afterOneSecond, afterTwoSeconds} from "../../EntityComposables"
import heart from "assets/heart.svg"
import goblin from "assets/goblin.svg"

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
    name: "Goblin",
    isGrounded:false,
    health: ref(3),
    movementSpeed: ref(4),
    damage: ref(30),

    entityId: ref(props.id),  
    initial_x:props.initial_x,
    initial_y:props.initial_y,
    hitbox_width: 70,
    hitbox_height: 140,
    emit,
  }

const enemy = useEnemy(props,{...enemyData})
const {position_x,position_y} = useMovementManager(props,useSpawnGrounded,enemy,enemyData)

const styleObject = usePositionStyle(position_x,position_y,enemyData.hitbox_width, enemyData.hitbox_height)


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
      <img :src="goblin" alt="">
    <br>


  </div>

</template>


<style lang="scss" scoped>

</style>