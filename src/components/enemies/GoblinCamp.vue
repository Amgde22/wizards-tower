<script setup>
import uniqid from "uniqid"
import { computed, onMounted, ref, toValue, watch, watchEffect } from "vue";
import {usePositionStyle ,useMovementManager,useSpawnGrounded,useEnemy,giveEnemyKnockbackImmunity,onReachedBase,everyTwoSeconds} from "../../EntityComposables"
import goblinCamp from "assets/goblinCamp.svg"
import heart from "assets/heart.svg"

const emit = defineEmits(["enemyDied","arrived","newEnemy"])

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


const minimum_distance = 100 // pixels
const base_distance = 250 // pixels
const random_distance_mod  = Math.round(Math.random() * base_distance) + minimum_distance // minimum of 100px from right
const enemyData =
  {
    name: "Goblin",
    health: ref(5),
    movementSpeed: ref(3),
    x_distance:ref(random_distance_mod),
    damage: ref(30),

    entityId: ref(props.id),  
    initial_x:props.initial_x,
    initial_y:props.initial_y,
    hitbox_width: 140,
    hitbox_height: 140,
    emit,
  }

const enemy = useEnemy(props,{...enemyData})
const {position_x,position_y} = useMovementManager(props,useSpawnGrounded,enemy,enemyData)
const styleObject = usePositionStyle(position_x,position_y,enemyData.hitbox_width, enemyData.hitbox_height,enemy.isFlashing)

giveEnemyKnockbackImmunity(enemy)

everyTwoSeconds(props, ()=>{
  if (enemy.isFrozen.value || enemy.isHypnotized.value) return
  const random_y = Math.random() * 50
  const x_offset = 35
  const y_offset = 150 + random_y
  emit("newEnemy",{
    name:"Bat",
    initial_x:toValue(position_x) - x_offset,
    initial_y:toValue(position_y) - y_offset
  })
})

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
    absolute grid place-items-center border-2 border-amber-800">
    <div class="enemy-health-container">
      <img v-for="n in enemyData.health.value" :key="n" :src="heart" alt="Heart">
    </div>
      <img class="icon-xl"  :src="goblinCamp" alt="">
    <br>


  </div>

</template>


<style lang="scss" scoped>

</style>