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
  }
})
// const levelIndex = ref(0)
const levels = useLevels(props)
const currentLevel = computed(()=>levels[props.level - 1] )

const sectionIndex = ref(1) // we start at section1 of each level
const currentSectionName = computed(()=>"section" + sectionIndex.value )

const currentEnemyIndex = ref(0)


watch(props , ()=>{
  if (props.insideLevel == false || currentLevel.value == undefined ) return // don't spawn enemies 
  const tick  = props.tick
  const currentSection = currentLevel.value[currentSectionName.value]

  if (tick % currentSection.spawnTimer == 0) {

    const enemyToSpawn = currentSection.enemyComponentList[currentEnemyIndex.value]
    if(typeof enemyToSpawn =="undefined" ){
      nextSection() // all current section enemies have spawned
      return
    }
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
    const nextSection = currentLevel.value["section" + (sectionIndex.value + 1)]
    if(typeof nextSection != "object" ){
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