<template >
  <!-- <div class="gold-box" :style="goldBoxStyles">O</div> -->

  <EnemySpawner 
  :tick="tick" 
    :insideLevel="insideLevel" 
    :level="level"
    :NumberOfEnemiesOnField="NumberOfEnemiesOnField"
    :injectedSection="injectedSection"

    @newEnemy=" spawnEnemy($event)" 
    @levelFinished="finishLevel"
  />

<main class="layout">
  <div 
  :class="devMode?'':'hidden'"
  class="debug-menu
  absolute w-full border-violet-900 border-2 z-50 bg-black bg-opacity-95 p-2">
    <button @click="devMode = !devMode">DevMode : {{ devMode?"On":"Off" }}</button>
    <button @click="enemiesOnField = {}">Clear</button>
    <button @click="pushEnemy('Bat')">Spawn Bat</button>
    <button @click="pushEnemy('FrozenBat')">Spawn FrozenBat</button>
    <button @click="pushEnemy('EvasiveBat')">Spawn EvasiveBat</button>
    <button @click="pushEnemy('GiantBat')">Spawn GiantBat</button>
    <button @click="pushEnemy('ShieldBat')">Spawn SBat</button>
    <button @click="pushEnemy('Goblin')">Spawn Goblin</button>
    <button @click="pushEnemy('GoblinCamp')">Spawn GoblinCamp</button>
    <button @click="pushEnemy('ShieldGoblin')">Spawn SGoblin</button>
    <!-- <button @click="damagePlayer(50)">Get hit</button>
    <button @click="healPlayer(50)">heal Up!</button> -->

    <button @click="forceNextLevel">Next level</button>
    <span class="py-1 px-2 border border-red-500">level : {{ level }}</span>
    <span class="py-1 px-2 border border-red-500">injected section : {{ injectedSection }}</span>
    <!-- <span class="py-1 px-2 border border-white">Selected Spell : {{ selectedSpell?.componentName }}</span> -->
    <span class="py-1 px-2 border border-white ml-auto">{{ tick }}</span>
    <button v-for="n in levels.length" class="w-6" @click="jumpToLevel(n)">{{ n }}</button>
  </div>

<!-- navbar -->
  <div class="navbar flex px-2 items-center gap-1 border-2 border-gray-400">
    <ManaBar :manaCapacity="manaCapacity" :manaSupply="mana" :manaToBeUsed="selectedSpell?.manaCost"/>
    <HealthBar :max-health="maxHealth" :current-health="currentHealth" />
    <span class="navbar-item py-1 px-2 border-2 border-amber-400 flex items-end">
      {{ money }} <img :src="coinsSrc" class="icon" alt="">
    </span>
    <button @click="pause()" class="ml-auto navbar-item">
      <img v-if="paused" class="icon" :src="playButtonLightSrc" alt="">
      <img v-else class="icon-sm" :src="pauseButtonSrc" alt="">
    </button>
    <span class="py-1 px-2 border border-white">{{ tick }}</span>

    <button v-if="insideLevel" class="navbar-item ml-auto py-1 px-2 text-gray-800 border border-purple-500 bg-purple-300">
      level:{{ level }}
    </button>
    <button v-else-if="shopVisible == false" @click="openShop" class="navbar-item ml-auto py-1 px-2 text-gray-800 border border-amber-500 bg-amber-300">
      Shop 
      <img class="icon-sm" :src="playButtonDarkSrc" alt="">
    </button>
    <button v-else-if="shopVisible == true" @click="closeShop();startLevel()" class="navbar-item ml-auto py-1 px-2 text-gray-800 border border-amber-500 bg-amber-300">
      level: {{ level }} 
      <img class="icon-sm" :src="playButtonDarkSrc" alt="">
    </button>


  </div>
<!-- base -->
  <div class="base tower grid place-items-center bg-slate-600 border-slate-700 border-4 border-r-red-600">
    <img class="icon-xl" :src="whiteTowerSrc" alt="">
  </div>
<!-- field -->
  <div class="field isolate relative  overflow-hidden border-4 border-gray-200 border-l-red-500"  >

    <Guide v-if="level == 1 && !shopVisible && levelIsFinished" :spellsOnField="spellsOnField" />

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

      @arrived="damagePlayer($event)"
      @enemy-died="removeEnemy" 
      @newEnemy="spawnEnemy({...$event,isChildOfEnemy:true})" 
    />

    <LevelCompleteDisplay :levelIsFinished="levelIsFinished" :level="level" />
    <Shop 
      :shopVisible="shopVisible" 
      :money="money" 
      :spells-on-hand="spellsOnHandNames" 
      :currentHealth="currentHealth"
      :maxHealth="maxHealth"
      @spend-money="reduceMoney($event)"
      @spell-bought="addSpellToHand($event)"
      @health-bought="increaseMaxHealth($event)"
      @heal-bought="healPlayer($event)"
      @mana-bought="increaseManaCapacity($event)"
      @mana-regen-bought="increaseManaRegenerationRate($event)"
    />
  </div>
<!-- spell menu -->
  <div class="spell-menu flex p-6 gap-3 border-2 border-gray-400"
  @click.self="deselectSpell()">

    <p class="pt-5">spells:</p>

    <div v-for="spellName,index in spellsOnHandNames" class="flex flex-col w-min items-center">
      <!-- keyboard button -->
      <p>{{ index + 1 }}</p> 
      <!-- spell name -->
      <SpellSelector 
        :tick="tick"
        :spellName="spellName"
        :selectedSpell="selectedSpell"
        :cooldown="spellCooldowns[spellName]"
        :spellIndex="index"

        @spell-selected="selectSpell($event)"
        @spell-deselected="deselectSpell($event)"
        @dragging-started="isDraggingSpell = true"
        @dragging-ended="isDraggingSpell = false"
      />
    </div>
  
    <p class="keyboard-shortcuts-container">
      (Q = pause) / (1 to 8) = select spell
    </p>
  </div>


</main>


</template>



<script>
import coinsSrc from "./assets/coins.svg"
import whiteTowerSrc from "./assets/white-tower.svg"
import playButtonDarkSrc from "./assets/play-button-dark.svg"
import playButtonLightSrc from "./assets/play-button.svg"
import pauseButtonSrc from "./assets/pause-button.svg"
import uniqid from "uniqid"

import ManaBar from "./components/ManaBar.vue"
import EnemyField from "./components/EnemyField.vue"
import Guide from "./components/Guide.vue"
import EnemySpawner from "./components/enemySpawner/EnemySpawner.vue"
import * as AllSpells from "./components/spells/spells"
import SpellPlacer from "./components/SpellPlacer.vue"
import SpellSelector from "./components/SpellSelector.vue"
import timers from "./stores/secondsInTicks"
import HealthBar from "./components/HealthBar.vue"
import Shop from "./components/Shop.vue"
import { getSpellDataByName } from "./functions"
import useLevels from "./components/enemySpawner/useLevels"
import LevelCompleteDisplay from "./components/LevelCompleteDisplay.vue"

export default {
  components: {
    ManaBar,
    SpellPlacer,
    EnemyField,
    EnemySpawner,
    ...AllSpells,
    SpellSelector,
    HealthBar,
    Shop,
    Guide,
    LevelCompleteDisplay
},
  data() {
    return {
      // controlls
      tick:0,
      nextTickInterval:setInterval(this.nextTick,50),//will rerender each time
      // nextTickInterval:setInterval(this.nextTick,15),// for testing
      devMode:false,
      paused:false,
      shopVisible:false,

      // level stuff
      level:1,
      levels:useLevels(),
      insideLevel:false,
      injectedSection:null, // only for testing
      // constants
      fieldWidth:754,
      fieldHeight:474,
      // variables
      money:400,
      maxHealth:100,
      currentHealth:100,
      manaCapacity:100,
      mana:100,
      manaPerSecond: 14.28,// 7 secs for full mana
      enemiesOnField:{},
      enemiesOnFieldRefs : [],
      spellsOnHand:[
        AllSpells.Fireball ,
      ],
      spellCooldowns:{
        Fireball:0,
        // Thunder:0,
        // IceWind:0
      },
      selectedSpell:null,
      isDraggingSpell:false,
      spellsOnField:[],

      //icons (bs that i have to define them here)
      coinsSrc,
      whiteTowerSrc,
      playButtonDarkSrc,
      playButtonLightSrc,
      pauseButtonSrc
    }
  },
  methods: {
    nextTick(){
        if (this.paused == true) return
        this.tick++
      },
// options
    pause(){
      this.paused = !this.paused
    },
    toggleDevMode(){
      this.devMode = !this.devMode
    },
    toggleShop(){
      this.shopVisible = !this.shopVisible
    },
    openShop(){
      this.shopVisible = true
    },
    closeShop(){
      this.shopVisible = false
    },
// health
    healPlayer(healValue){
      if((this.currentHealth + healValue) > this.maxHealth ){
        this.currentHealth = this.maxHealth
      }
      else{
        this.currentHealth += healValue
      }
    },
    damagePlayer(damageValue){
      if((this.currentHealth - damageValue) < 0 ){
        this.currentHealth = 0
      }
      else{
        this.currentHealth -= damageValue
      }
    },
// mana
    fillMana(ammount){
      this.mana = Math.round( this.mana + ammount )
      if (this.mana >= this.manaCapacity) {
        this.mana = this.manaCapacity
      }
    },
    decreaseMana(ammount){
      if(this.devMode) return
      const original_mana = this.mana
      this.mana = Math.round( this.mana - ammount )
      if (this.mana < 0) {
        console.error(`decreased too much mana , original value was ${original_mana} , decrease ${ammount} from it`);
        this.mana = 0
      }
    },
// enemies
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
      delete this.enemiesOnField[deadEnemyId]
      const isChildOfEnemy = this.childrenEnemies.find(enemy => true)
        if (isChildOfEnemy) return
        // if enemy is not spawned by other enemy , increase money

        this.increaseMoney(5)
    },
    updateEnemiesOnFieldRefs(){
      const enemiesOnFieldRefs= this.$refs.enemyField.$refs.enemies
      if (enemiesOnFieldRefs == undefined) return
      if (enemiesOnFieldRefs) {
        this.enemiesOnFieldRefs = [...enemiesOnFieldRefs] // flat so even if enemy.vue exposes an array of enemies we are good
      }
    },
// spells
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
    selectSpellByIndex(index){
      const spellName = this.spellsOnHandNames[index]
        if(spellName == undefined) return
      const spellData = getSpellDataByName(spellName)
        if (spellData == undefined) return
      this.selectSpell(spellData)
    },
    deselectSpell(spell){
      if (spell != null && this.selectedSpell != null) {
        if ( spell.componentName == this.selectedSpell.componentName ) {
          this.selectedSpell = null
        }
        else{
          console.warn("unselected spell trying to deselect",this.selectedSpell,spell);
        }
      }
      else{
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
        if (this.spellCooldowns[spellName] == undefined) {
          this.spellCooldowns[spellName] = 0
        }
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
// level
    startLevel(){
      this.insideLevel = true
      this.shopVisible = false
    },
    finishLevel(){
      console.log(`not inside level ${this.level} anymore , stoping enemy spawns and goint to next level ...`);
      this.level++
      this.insideLevel = false
    },

  calculateMoney(levelIndex) {
    const levels = useLevels()
    const level = levels[levelIndex]
      if (level == undefined) return 0
    const level_money_modifier = (levelIndex+1) 

    let totalMoney = 0;

        for (const section in level) {
          const enemyComponentList = level[section].enemyComponentList;
          enemyComponentList.forEach(enemyGroup => {
            if (Array.isArray(enemyGroup)) {
              totalMoney += enemyGroup.length;
            } else {
              totalMoney += 1;
            }
          });
        }
      return (totalMoney * 10 * level_money_modifier)
    },
    forceNextLevel(){
      // const levelIndex = this.level - 1
      // const levelMoney = this.calculateMoney(levelIndex)
      // console.log({levelMoney});
      // this.increaseMoney(levelMoney)
      this.level++
    },
    jumpToLevel(finishin_level){
        if (finishin_level < this.level) {
          this.level = finishin_level 
          return
        }

        this.level = finishin_level
    },
    getLevelReward(level){
      const levelIndex = level-1
      const levels_rewards = [
        650, 800, 1600, 1800, 2600, "VI", "VII", "VIII", "IX", "X"
      ];
      const gained_money = levels_rewards[levelIndex] || 0
      this.increaseMoney(gained_money)
    },
// shop / money
    increaseMoney(value){
      if (typeof value != "number") return
      this.money += value
    },
    reduceMoney(value){
      this.money -= value
    },
    addSpellToHand(spellData){
      const spellName = spellData.componentName
      const spellComponent = AllSpells[spellName]
        if (spellComponent == undefined) {
          console.error(`spells.js does not export spell of name :${spellName}`, {spellName,spellData,AllSpells})
          return
        }
      this.spellsOnHand.push(
        spellComponent
      )
      this.spellCooldowns[spellName] = 0
    },
    increaseMaxHealth(value){
      this.maxHealth += value
      this.healPlayer(value)
    },
    increaseManaCapacity(value){
      this.manaCapacity += value
    },
    increaseManaRegenerationRate(value){
      this.manaPerSecond += value
    }

},
computed: {
  childrenEnemies(){
    return Object.values(this.enemiesOnField)
      .filter(enemy => enemy.isChildOfEnemy);
  },
  spellsOnHandNames() {
    return this.spellsOnHand.map(spellComponent=>{
      return spellComponent.__name
    })
  },
  levelIsFinished(){
    if (this.insideLevel == false  && Object.keys(this.enemiesOnField).length == 0) 
      {return true}
    else{
      return false
    }
  },
  NumberOfEnemiesOnField(){
    return Object.keys(this.enemiesOnField).length
  }
  // shopVisible(){
  //   // return true
  //   if (this.levelIsFinished == true && this.level > 1 ) {
  //     return true
  //   }
  //   else{
  //     return false
  //   }
  // }
},

mounted () {

const pause = this.pause
const toggleDevMode = this.toggleDevMode
const toggleShop = this.toggleShop
const selectSpellByIndex = this.selectSpellByIndex
  window.addEventListener('keydown', function(event) {
    if (event.key === 'q') {
        pause()
    }
    if (event.key === 'd') {
      toggleDevMode()
    }
    if (event.key === 's') {
      // toggleShop()
    }
    if (event.key === '1') {
        selectSpellByIndex(0);
    } else if (event.key === '2') {
        selectSpellByIndex(1);
    } else if (event.key === '3') {
        selectSpellByIndex(2);
    } else if (event.key === '4') {
        selectSpellByIndex(3);
    } else if (event.key === '5') {
        selectSpellByIndex(4);
    } else if (event.key === '6') {
        selectSpellByIndex(5);
    } else if (event.key === '7') {
        selectSpellByIndex(6);
    } else if (event.key === '8') {
        selectSpellByIndex(7);
    } else if (event.key === '9') {
        selectSpellByIndex(8);
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

  currentHealth(newHealth){
    if(this.devMode == true) return
    if (newHealth == 0) {
      alert("you died")
    }
  },

  level(newLevel , prevLevel){
    if (newLevel < prevLevel) return

    // newLevel 2
    // prevLevel 1
    for (let level = prevLevel; level < newLevel; level++) {
      this.getLevelReward(level)
    }
  }
},

}
</script>

<style>
.layout {
  position: relative;
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
.shop-field { 
  grid-area: 1 / 1 / 5 / 9 ; 
}

.keyboard-shortcuts-container{
  font-size: 14px;
  opacity: 0.85;
  position: absolute;
  bottom: 0.5em;
}

</style>
