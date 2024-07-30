<script setup>
import { ref, watch ,toValue, onMounted} from 'vue';
import { useMoveToRight,OnCollisionWithEnemy,usePositionStyle,OnPierceDepleated,onReachedEnd ,everyFifthSecond} from '@/EntityComposables';
import useSpellData from './useSpellData';
import fireIcon from "assets/spiked-dragon-head.svg";


const emit = defineEmits(["disappear","spawn-spell"])
const  props  = defineProps({
  tick: Number,
  enemiesOnFieldRefs: Array,
  initial_x: Number,
  initial_y: Number,
  id: String,
});



const spellData = useSpellData.getFireRaysData(props)
const numberOfShots = ref(spellData.numberOfShots)

const position_x = props.initial_x
const position_y = props.initial_y
const styleObject = usePositionStyle(position_x,position_y,spellData.hitbox_width,spellData.hitbox_height)

onMounted(()=>{
  everyFifthSecond(props,()=>{
    if (numberOfShots.value == 0){
      emit("disappear",props)
    } 

    const randomAngle = generateRandomAngle();

    emit('spawn-spell',{
      componentName:"FireRay",
      initial_x:position_x +spellData.hitbox_width ,
      initial_y:position_y + spellData.hitbox_height/2 - 20,
      angle:randomAngle
    })
    numberOfShots.value--
  })
})
function generateRandomAngle() {
    // Define probabilities for different angles
    // Adjust these weights as desired
    const weights = [10, 20, 30, 20, 10]; // 0, 15, 30, -15, -30 degrees

    // Generate a random index based on the weights
    const index = weightedRandom(weights);

    // Map the index to the corresponding angle
    const angles = [20,10,0,-10,-20];
    const angle = angles[index];

    return angle;
}

// Helper function to generate a weighted random index
function weightedRandom(weights) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const randomValue = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (randomValue < cumulativeWeight) {
            return i;
        }
    }

    // Fallback (shouldn't happen)
    console.log("it happened lol");
    return 0;
}
// Example usage:
// console.log(`Random angle: ${randomAngle} degrees`);

</script>



<template>
  <div
  :style="styleObject"
  class="spell
  absolute border-2 border-amber-600 text-amber-600">
  <img class="icon-lg" :src="fireIcon" alt=""><br>
  </div>
</template>