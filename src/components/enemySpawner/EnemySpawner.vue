<template>
  <span>
    <!-- this component is only used to emit events -->
  </span>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import useLevels from "./useLevels"
const emit = defineEmits(["newEnemy","levelFinished"])
const props = defineProps({
  tick:{
    type:Number,
    required:true
  },
  level:{
    type:Number,
    required:true
  },
  insideLevel:{
    type:Boolean,
    required:true
  },
  NumberOfEnemiesOnField:{
    type:Number,
    required:true
  },
  injectedSection:[Number,null]
})

const levels = useLevels()
const currentLevel = computed(()=>levels[props.level - 1] )


const sectionIndex = ref(props.injectedSection??1) // we start at section1 of each level
const currentSectionName = computed(()=>"section" + sectionIndex.value )

const currentEnemyIndex = ref(0)
// every tick fire callback
watch(()=>props.tick , ()=>{
   // don't spawn enemies if no level or not inside level
  if (props.insideLevel == false || currentLevel.value == undefined ) return

  const tick  = props.tick
  const currentSection = currentLevel.value[currentSectionName.value]

  // very second or everyHaldSecond (depending on level.spawnTimer)
  if (tick % currentSection.spawnTimer == 0) {
    const enemyToSpawn = currentSection.enemyComponentList[currentEnemyIndex.value]
      // debuggin
      // console.log("searching for group No:",currentEnemyIndex.value);
    if(typeof enemyToSpawn == "undefined" ){ 
        // debuggin
        // console.log("no more enemies in ",currentSectionName.value,{enemyToSpawn});
      // all current section enemies have spawned
      nextSection() 
      return
    }
      // debuggin
      // console.log(`spawning enemy No:`,currentEnemyIndex.value, "on tick:",tick);
      console.log("spawning :",enemyToSpawn,"as part of:",currentSectionName.value);
    spawnNewEnemy(enemyToSpawn)
    currentEnemyIndex.value++
  }

})

watch(currentLevel , ()=>{
  sectionIndex.value = 1 // start at section 1 again
})
watch(sectionIndex , ()=>{
  currentEnemyIndex.value = 0 // start at beginning of new section
})

  function nextSection() {
    // only go to next section if all enemies are dead
    if (props.NumberOfEnemiesOnField > 0) return

    const nextSection = currentLevel.value["section" + (sectionIndex.value + 1)]

    if(typeof nextSection != "object" ){
      // no more section = level is done
      emit("levelFinished");
      return
    }



    sectionIndex.value++
    console.log(sectionIndex.value , "in" , currentSectionName.value);
  }


  function spawnNewEnemy(spawningEnemy) {
    const argIsString = typeof spawningEnemy == "string"
    const argIsObject =  typeof spawningEnemy == "object" && !Array.isArray(spawningEnemy)  
    const argIsArray = Array.isArray(spawningEnemy) 
//     console.log({arg:spawningEnemy,argIsString,argIsObject,argIsArray});
// return
    if(argIsObject){
      emit("newEnemy",spawningEnemy)
    }
    else if(argIsArray){ // enemy to spawn is an array of enemies
      spawningEnemy.forEach(enemy =>{
        spawnNewEnemy(enemy)
      })
    }
    else if(argIsString){
      emit("newEnemy",{
        name:spawningEnemy
      })
    }
  }

</script>

<style lang="scss" scoped>

</style>