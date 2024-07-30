import { ref } from "vue"

//useSpellData.js
export default {
  getFireballData,
  getIceWindData,
  getThunderData,
  getGhostballData,
  getFireRaysData,
  getWindBlastData,
  getDarkSpiritData
}

function getnameData(props){
  return{
    color:"white",
    placeSection:"left",
    componentName: "name",
    spellName: "name",
    description:"a spell",
    price:500,
    damage: 2,
    movementSpeed: 15,
    manaCost:15,
    cooldown:0,
    pierce:ref(8),
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    alreadyHitEnemyIds : ref([]),
  }
}

function getFireballData(props){

  return {
    color:"orange",
    placeSection:"left",
    componentName: "Fireball",
    spellName:"Fire ball",
    description:"basic fire spell , damages enemies",
    movementSpeed: 15,
    damage: 1,
    manaCost:35,
    cooldown:1,
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    pierce:ref(8),
    alreadyHitEnemyIds : ref([]),
  }
}

function getIceWindData(props){
  return {
    color:"lightblue",
    placeSection:"left",
    componentName: "IceWind",
    spellName: "ice bolt",
    description:"Freezes enemies; flying foes crash down, causing damage",
    movementSpeed: 40,
    price:500,
    damage: 0,
    manaCost:20,
    cooldown:6,
    hitbox_width: 70,
    hitbox_height: 40, 
    spellId: props?.id,  
    pierce:ref(1),
    alreadyHitEnemyIds : ref([]),
  }
}
function getThunderData(props){
  return {
    color:"gold",
    placeSection:"whole",
    componentName: "Thunder",
    description:"summon thunder , can be placed anywhere",
    price:500,

    movementSpeed: 0,
    damage: 1,
    manaCost:50,
    cooldown:8,
    hitbox_width: 35,
    hitbox_height: 70, 
    spellId: props?.id,  
    pierce:ref(16),
    alreadyHitEnemyIds : ref([]),
  }
}
function getGhostballData(props){
  return {
    color:"gray",
    placeSection:"left",
    componentName: "Ghostball",
    spellName: "Ghost ball",
    description:"an easyily casted short ranged spell!",
    price:500,
    damage: 2,
    movementSpeed: 15,
    manaCost:15,
    cooldown:0,
    pierce:ref(8),
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    alreadyHitEnemyIds : ref([]),
  }
}
function getFireRaysData(props){
  return{
    color:"#d97706",
    placeSection:"left",
    componentName: "FireRays",
    spellName: "Dragon",
    description:"A dragon that fires 16 shots of fire rays at random angles , light knockback",
    numberOfShots:16,
    price:500,
    damage: 1,
    movementSpeed: 35,
    manaCost:75,
    cooldown:16,
    pierce:ref(1),
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    alreadyHitEnemyIds : ref([]),
  }
}
function getIceAgeData(props){
  return{
    color:"orange",
    placeSection:"left",
    componentName: "FireRays",
    spellName: "Fire Rays",
    description:"fires 16 shots of fire rays at random angles , low accuracy",
    numberOfShots:16,
    price:500,
    damage: 1,
    movementSpeed: 35,
    manaCost:35,
    cooldown:0,
    pierce:ref(1),
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    alreadyHitEnemyIds : ref([]),
  }
}

function getWindBlastData(props) {
return{
  color:"#22c55e",
  placeSection:"left",
  componentName: "WindBlast",
  spellName: "Wind Blast",
  description:"a spell that knocks a group enemies back , no damage but low mana cost",
  // knockBackPower:220, its in component instead
  price:500,
  damage: 0,
  movementSpeed: 55,
  manaCost:5,
  cooldown:3,
  pierce:ref(1),
  hitbox_width: 85,
  hitbox_height: 85, 
  spellId: props?.id,  
  alreadyHitEnemyIds : ref([]),
}
}

function getDarkSpiritData(props){
  return{
    color:"#760CAD",
    placeSection:"left",
    componentName: "DarkSpirit",
    spellName: "Dark Spirit",
    description:"posesses an enemy and makes it fight for you , give it 1 Extra health",
    price:500,
    damage: 1,
    movementSpeed: 12,
    manaCost:40,
    cooldown:5,
    pierce:ref(1),
    hitbox_width: 70,
    hitbox_height: 70, 
    spellId: props?.id,  
    alreadyHitEnemyIds : ref([]),
  }
}