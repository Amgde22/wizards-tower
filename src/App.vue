<template >
  <!-- <div class="gold-box" :style="goldBoxStyles">O</div> -->

  <EnemySpawner 
    :insideLevel="insideLevel" 
    :tick="tick" 
    :level="level"

    @newEnemy=" spawnEnemy($event)" 
    @levelFinished="finishLevel"
  />

<main class="layout">
<!-- navbar -->
  <div class="navbar flex  items-center block">
    <!-- <span class="py-1 px-2 border border-blue-950 bg-blue-800 text-white">{{ mana }}</span> -->
    <button @click="devMode = !devMode">DevMode : {{ devMode?"On":"Off" }}</button>
    <ManaBar :manaCapacity="manaCapacity" :manaSupply="mana" :manaToBeUsed="selectedSpell?.manaCost"/>

    <!-- <button @click="pushEnemy('Bat')">Spawn Bat</button> -->
    <button @click="pushEnemy('FrozenBat')">Spawn FrozenBat</button>
    <!-- <button @click="pushEnemy('EvasiveBat')">Spawn EvasiveBat</button> -->
    <button @click="pushEnemy('GiantBat')">Spawn GiantBat</button>
    <button @click="enemiesOnField = {}">Clear</button>
    <button @click="pause()"> ( {{ paused?"unpause":"pause" }} )</button>
    <span class="py-1 px-2 border border-white">{{ tick }}</span>

    <!-- <button @click="level++">Next level</button>
    <span class="py-1 px-2 border border-white">level : {{ level }}</span>
    <button @click="insideLevel = !insideLevel">{{insideLevel?"in level":"market place"}}</button> -->
    <!-- <span class="py-1 px-2 border border-white">Selected Spell : {{ selectedSpell?.componentName }}</span> -->

  </div>
<!-- base -->
  <div class="base grid place-items-center block">🏰</div>
<!-- field -->
  <div class="field isolate relative block  overflow-hidden"  >

    <SpellPlacer 
      :selectedSpell="selectedSpell" 
      :isDraggingSpell="isDraggingSpell" 

      @spellPlaced="spawnSelectedSpell($event)"
    />

    <component v-for="spell in spellsOnField" 
      :key="spell.id" 
      :is="spell.componentName"

      :tick="tick"
      v-bind="spell"
      :enemiesOnFieldRefs="enemiesOnFieldRefs"

      @disappear="removeSpell"
      @spawnSpell="spawnSpell"
    />

    <EnemyField 
    ref="enemyField" 
      :tick="tick"
      :enemiesOnField="enemiesOnField"

      @enemy-died="removeEnemy" 
      @newEnemy="spawnEnemy($event)" 
    />
  </div>
<!-- spell menu -->
  <div class="spell-menu block flex p-6 gap-3"
  @click.self="deselectSpell()">
    <SpellSelector v-for="spellName in spellsOnHandNames"
      :tick="tick"
      :spellName="spellName"
      :selectedSpell="selectedSpell"
      :cooldown="spellCooldowns[spellName]"

      @spell-selected="selectSpell($event)"
      @spell-deselected="deselectSpell($event)"
      @dragging-started="isDraggingSpell = true"
      @dragging-ended="isDraggingSpell = false"
    />
  </div>
</main>


</template>



<script>
import uniqid from "uniqid"

import ManaBar from "./components/ManaBar.vue"
import EnemyField from "./components/EnemyField.vue"
import EnemySpawner from "./components/enemySpawner/EnemySpawner.vue"
import DummyBat from "./components/enemies/DummyBat.vue"
import * as AllSpells from "./components/spells/spells"
import SpellPlacer from "./components/SpellPlacer.vue"
import SpellSelector from "./components/SpellSelector.vue"
import timers from "./stores/secondsInTicks"


export default {
  components: {
    ManaBar,
    SpellPlacer,
    EnemyField,
    EnemySpawner,
    DummyBat,
    ...AllSpells,
    SpellSelector
},
  data() {
    return {
      // controlls
      devMode:true,
      tick:0,
      nextTickInterval:setInterval(this.nextTick,50),//will rerender each time
      paused:false,

      // level stuff
      level:1,
      insideLevel:false,
      // constants
      fieldWidth:754,
      fieldHeight:474,
      // variables
      manaCapacity:100,
      mana:100,
      manaPerSecond: 14.28,// 7 secs for full mana
      enemiesOnField:{},
      enemiesOnFieldRefs : [],
      spellsOnHand:[
        AllSpells.Fireball 
        , AllSpells.Thunder
        , AllSpells.Ghostball
      ],
      spellCooldowns:{
        Fireball:0,
        Thunder:0
      },
      selectedSpell:null,
      isDraggingSpell:false,
      spellsOnField:[],
      
      goldBoxStyles:{
        top:"80px",
        left:"200px"
      }
    }
  },
  methods: {
    nextTick(){
        if (this.paused == true) return
        this.tick++
      },
    pause(){
      this.paused = !this.paused
    },
    fillMana(ammount){
      this.mana = Math.round( this.mana + ammount )
      if (this.mana >= this.manaCapacity) {
        this.mana = this.manaCapacity
      }
    },
    decreaseMana(ammount){
      const original_mana = this.mana
      this.mana = Math.round( this.mana - ammount )
      if (this.mana < 0) {
        console.error(`decreased too much mana , original value was ${original_mana} , decrease ${ammount} from it`);
        this.mana = 0
      }
    },
    spawnEnemy(enemyData){
      this.addToEnemiesOnField(enemyData)
    },

    addToEnemiesOnField(enemyData){
      const enemyId = uniqid() 
        this.enemiesOnField[enemyId] = {
          ...enemyData ,
          id:enemyId
        }
    },
    pushEnemy(componentName){
      const someId = uniqid() 
      this.enemiesOnField[someId] = {
        name : componentName,
        id:someId
      }
    },
    removeEnemy(deadEnemyId){
      console.log(deadEnemyId);
      delete this.enemiesOnField[deadEnemyId]
    },

    spawnSpell(spellData){
      this.spellsOnField.push({
        ...spellData,
        id:uniqid(),
        spawnedByAnotherSpell:true
      })
    },
    selectSpell(spell){
      this.selectedSpell = null
        // ensures selected spell is null first before it's update to avoid errors
      Promise.resolve().then(()=>{
        this.selectedSpell = spell
      })
    },
    deselectSpell(spell){
      if (spell != null && this.selectedSpell != null) {
        if ( spell.componentName == this.selectedSpell.componentName ) {
          // console.log('deselecting spell:',spell);
          this.selectedSpell = null
        }
        else{
          console.warn("unselected spell trying to deselect",this.selectedSpell,spell);
        }
      }
      else{
        // console.log('deselecting all spells');
        this.selectedSpell = null
      }
    },
    spawnSelectedSpell(spellSpawnPosition){
      const currentSpellData = this.selectedSpell
      const {initial_x,initial_y} = spellSpawnPosition

      const spellCanBeSpawned = this.checkIfSpellCanBeSpawned(currentSpellData)
      if (spellCanBeSpawned == false) return

      this.spellsOnField.push({
        componentName:currentSpellData.componentName,
        initial_x,
        initial_y,
        id:uniqid()
      })

      this.putSpellOnCooldown(currentSpellData)
      this.decreaseMana(currentSpellData.manaCost)
      this.deselectSpell(this.selectedSpell)
    },
    checkIfSpellCanBeSpawned(spellData){
      const spellName = spellData.componentName
      const spellOnCooldown = this.spellCooldowns[spellName] > 0
      
      const manaCost = spellData.manaCost
      const isEnoughMana = this.mana >= manaCost

      return (!spellOnCooldown && isEnoughMana)
    },
    putSpellOnCooldown(spellData){
      if (this.devMode) return
      const spellName = spellData.componentName
      const cooldownAmmount = spellData.cooldown
      this.spellCooldowns[spellName] += cooldownAmmount
    },
    pushFireball(){
      this.spellsOnField.push({
        componentName:"Fireball",
        initial_x:0,
        initial_y:75,
        id:uniqid(),
      })
    },

    removeSpell(removedSpell){
      this.spellsOnField = this.spellsOnField.filter(spell=>{
        return spell.id != removedSpell.id
        })
    },
    decreaseCoolDowns( amount ){
      for (const spellName in this.spellCooldowns) {
        if (this.spellCooldowns[spellName] > 0) {
          this.spellCooldowns[spellName] -= amount
        }
      }
    },
    updateEnemiesOnFieldRefs(){
      const enemiesOnFieldRefs= this.$refs.enemyField.$refs.enemies
      if (enemiesOnFieldRefs) {
        this.enemiesOnFieldRefs = [...enemiesOnFieldRefs]
      }
    },
    finishLevel(){
      console.log(`not inside level ${this.level} anymore , stoping enemy spawns and goint to next level ...`);
      this.level++
      this.insideLevel = false
    },
},
computed: {
  spellsOnHandNames() {
    return this.spellsOnHand.map(spellComponent=>{
      return spellComponent.__name
    })
  }
},
mounted () {
const pause = this.pause
  window.addEventListener('keydown', function(event) {
    if (event.key === 'q') {
        // Call your function here
        pause()
    }
});
},
watch: {
  tick(newTick) {
    this.updateEnemiesOnFieldRefs()

    // every second do this
    if (newTick % timers.oneSecond == 0) {
      this.decreaseCoolDowns( 1 )
    }

    // every 0.2 seconds do this
    if (newTick % timers.fifthSecond == 0) {
      this.fillMana(this.manaPerSecond * 0.2)
      if (this.devMode) {
        this.fillMana(9001)
      }
    }
  },

},

}
</script>

<style>
.layout {
  margin: auto;
display: grid;
width: fit-content;
height: 100%;
grid-template-columns: 135px 889px;
grid-template-rows: 64px 474px 1fr;
grid-column-gap: 0px;
grid-row-gap: 0px;

}

.navbar { grid-area: 1 / 1 / 2 / 3; }
.base { grid-area: 2 / 1 / 3 / 2; }
.field { grid-area: 2 / 2 / 3 / 3; }
.spell-menu { grid-area: 3 / 1 / 4 / 3; }

.field {
  position: relative;
  display: grid;
  grid-template-areas: 
    'a b c d e f g h'
    'a b c d e f g h'
    'a b c d e f g h'
    'a b c d e f g h'
  ;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.enemy-field { 
  grid-area: 1 / 1 / 5 / 9 ; 
}
.gold-box{
  width: 70px;height: 70px;border: 2px solid goldenrod;
  position: absolute;


  color: goldenrod;
  display: grid;place-items:center;

}


</style>
