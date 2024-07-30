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
    componentName: "IceBlock",
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


OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  if (enemyRef.isFrozen == true) return 
  enemyRef.getHit(1)
})
watch(position_y , (position_y)=>{
  const ground_y = field_height - spellData.hitbox_height
  if (position_y >= ground_y) {
    // followedEnemyEnemyref.getHit(2)
  }
})

watch(()=>[followedEnemyEnemyref.isFrozen,followedEnemyEnemyref.isDead],()=>{
  emit('disappear', props); // ice block disappears if enemy is either [unfrozen,dead]
})

</script>



<template>
  <div
  :style="styleObject"
  class="spell
  absolute border-2 border-blue-600 text-blue-600">

  </div>
</template>

<style scoped>
  .spell{
    background-color: rgba(66, 165, 251, 0.466);
    z-index: 5;
  }

</style>