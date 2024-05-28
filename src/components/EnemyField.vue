<template>
  <div class="enemy-field relative">

    <component v-for="enemy,id in enemiesOnField"
    :key="id"
    :is="enemy.name || `Bat`"
      ref="enemies"

      :tick="tick"
      v-bind="enemy"

    @enemy-died="$emit(`enemyDied`,$event)"
    @new-enemy="$emit(`newEnemy`,$event)"
    />




</div>
</template>

<script>
import uniqid from "uniqid"
import * as AllEnemies from "./enemies/Enemies"
import DummyBat from "./enemies/DummyBat.vue";


  export default {
    components :{
    ...AllEnemies,
    DummyBat,
},

  data() {
    return {
      x: 5
    }
  },

    props:{
      tick:Number,
      enemiesOnField:Object,
    },

    emits:["enemyDied","newEnemy"],

  }
</script>

<style lang="scss" scoped>

</style>