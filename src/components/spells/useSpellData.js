import { ref } from "vue"

export default {
  getFireballData,
  getIceboltData,
  getThunderData,
  getGhostballData
}

function getSpellnameData(props){
  return{
    color:"color",
    placeSection:"left",
    componentName: "spellName",
    movementSpeed: 15,
    damage: 1,
    manaCost:15,
    cooldown:3,
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    pierce:ref(3),
    alreadyHitEnemyIds : ref([]),
  }
}

function getFireballData(props){

  return {
    color:"orange",
    placeSection:"left",
    componentName: "Fireball",
    movementSpeed: 15,
    damage: 1,
    manaCost:35,
    cooldown:1,
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    pierce:ref(3),
    alreadyHitEnemyIds : ref([]),

    
  }
}
function getGhostballData(props){
  return {
    color:"gray",
    placeSection:"left",
    componentName: "Ghostball",
    movementSpeed: 15,
    damage: 1,
    manaCost:15,
    cooldown:0,
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    pierce:ref(100),
    alreadyHitEnemyIds : ref([]),

    
  }
}
function getIceboltData(props){
  return {
    componentName: "Icebolt",
    movementSpeed: 25,
    damage: 0,
    manaCost:20,
    cooldown:6,
    hitbox_width: 50,
    hitbox_height: 30, 
    spellId: props?.id,  
    pierce:ref(1),
    alreadyHitEnemyIds : ref([]),
  }
}
function getThunderData(props){
  return {
    color:"gold",
    placeSection:"top",
    componentName: "Thunder",
    movementSpeed: 0,
    damage: 2,
    manaCost:50,
    cooldown:5,
    hitbox_width: 35,
    hitbox_height: 70, 
    spellId: props?.id,  
    pierce:ref(16),
    alreadyHitEnemyIds : ref([]),
  }
}