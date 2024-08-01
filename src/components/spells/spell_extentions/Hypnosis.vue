<script setup>
import { ref, watch ,toValue, computed, onUnmounted} from 'vue';
import { OnCollisionWithEnemy,usePositionStyle,field_height,OnPierceDepleated,onReachedEnd } from '../../../EntityComposables';

const emit = defineEmits(["disappear"])
const  props  = defineProps({
  tick: Number,
  enemiesOnFieldRefs: Array,
  followedEnemyEnemyref:Object,
  initial_x: Number,
  initial_y: Number,
  id: String,
});

const followedEnemyEnemyref = props.followedEnemyEnemyref


const spellData = {
    componentName: "Hypnosis",
    damage:1,
    spellId: props?.id,  
    hitbox_width : followedEnemyEnemyref.hitbox_width,
    hitbox_height : followedEnemyEnemyref.hitbox_height,
    pierce:ref(Number.POSITIVE_INFINITY),
    alreadyHitEnemyIds : ref([toValue(followedEnemyEnemyref.entityId)]),
  }

const position_x = computed(()=> followedEnemyEnemyref.position_x )
const position_y = computed(()=> followedEnemyEnemyref.position_y )
const styleObject = usePositionStyle(position_x,position_y,spellData.hitbox_width ,spellData.hitbox_height)

  let enemyResistance = 4 // hit 4 enemies = get hit 1 time
  const numberOfHitEnemies = ref(0)

OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  if (enemyRef.isHypnotized == true) return 
  enemyRef.getHit(1)
  numberOfHitEnemies.value++
})
watch(()=>followedEnemyEnemyref.entityId , (newId)=>{
  spellData.alreadyHitEnemyIds.value = [newId]
  enemyResistance = 2
})

watch(numberOfHitEnemies,(numberOfHitEnemies)=>{
  if (numberOfHitEnemies % enemyResistance == 0) {
    followedEnemyEnemyref.getHit(1)
  }
})
watch(()=>[followedEnemyEnemyref.isHypnotized,followedEnemyEnemyref.isDead,followedEnemyEnemyref],()=>{
  emit('disappear', props); // hypnosis disappears if enemy is either [unhypnotized,dead]
})

</script>



<template>
  <div
  :style="styleObject"
  class="spell
  absolute border-2 border-purple-600 text-purple-600">
  
  </div>
</template>

<style scoped>
  .spell{
    background-color:rgba(146, 52, 234, 0.45);
    z-index: 5;
  }

</style>