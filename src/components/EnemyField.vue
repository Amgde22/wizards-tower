<template>
  <div class="enemy-field relative">

    <component v-for="enemy,id in enemiesOnField"
    :key="id"
    :is="enemy.name || `Bat`"
      ref="enemies"

      :tick="tick"
      v-bind="enemy"

    @arrived="$emit(`arrived`,$event)"
    @enemy-died="$emit(`enemyDied`,$event)"
    @new-enemy="$emit(`newEnemy`,$event)"
    />




</div>
</template>

<script>
import uniqid from "uniqid"
import * as AllEnemies from "./enemies/Enemies"



  export default {
    components :{
    ...AllEnemies,
},

    props:{
      tick:Number,
      enemiesOnField:Object,
    },

    emits:["enemyDied","newEnemy","arrived"],

  }
</script>

<style lang="scss" scoped>

</style>