<template>
  <div class="shop-field absolute inset-0
      flex flex-col gap-4 
      border-2 border-green-700 p-5 z-50"
      :style="{
        transform:shopVisible?null:'scale(0)'
      }"
    >
    <h1 class="shop-header text-green-500 flex uderline">
      <img class="icon-lg  border-b border-green-500" :src="shopSrc" alt=""> 
      Shop: 
    </h1> 

    <section class="bonuses-container flex flex-row flex-wrap gap-x-4 gap-y-3">
      <ShopButton @bought="buyManaCapacity($event)" varient="blue" :base-price="150" :money="money" >max mana</ShopButton>
      <ShopButton @bought="buyManaRegenRate($event)" varient="dark-blue" :base-price="150" :money="money" >mana regen</ShopButton>
      <ShopButton @bought="buyHealth($event)" varient="red" :scaling-price="false" :base-price="50" :money="money" >Heal</ShopButton>
      <ShopButton @bought="buyMaxHealth($event)" varient="dark-red" :base-price="80" :money="money" >max health</ShopButton>
    </section>
    <!-- SPELLS  -->
    <section class="shop-spells-display flex gap-4 min-h-16">
      <div v-for="spellData in spells_not_on_hand_data" :key="spellData.componentName"
        class="shop-spell w-20 h-16 grid place-items-center cursor-pointer " 
        :class="{
          'floating':spellData.componentName == selectedSpell.componentName
        }"
        :style="{border:`3px solid ${spellData.color}`,}"
        @click="selectSpellToBuy(spellData)"
      >
        <span >{{ spellData.spellName ?? spellData.componentName }}</span>
          <span class="px-1 border border-amber-400 flex items-center">
            {{spellData.price}}
          <img :src="coinsSrc" class="icon-sm" alt="">
        </span>
      </div>
    </section>
    <!-- SPELL DESCIPTION -->
    <section v-if="spells_not_on_hand_data.length > 0" class="shop-spells-buy grow flex">
      <div class="spell-description flex flex-col">
        <!--spell description -->
        <span class="mx-2">{{ selectedSpell.description ?? "(select a spell)" }}</span> <br>
        <!--spell stats -->
        <div v-if="selectedSpell.damage != undefined" class="spell-stats">
          <span class="mx-2 text-red-300">damage:{{ selectedSpell.damage }}</span> /
          <span class="mx-2 text-blue-300">mana cost:{{ selectedSpell.manaCost }}</span> /
          <span class="mx-2 text-green-300">cooldown:{{ selectedSpell.cooldown }} sec(s)</span> /
          <span class="mx-2 text-orange-300">pierce:{{ selectedSpell.pierce }}</span> 
        </div>
        

      </div>
      <button class="spell-buy w-min relative"
      @click="buySelectedSpell">
        buy
        <span v-if="selectedSpell.price != undefined" class="cofirm-price text-yellow-300 absolute left-0 right-0 bottom-0">{{selectedSpell.price}}G</span>
      </button>

    </section>
  </div>
</template>

<script setup>
// shop.vue
import uniqueId from "uniqid"
import shopSrc from "assets/coinflip.svg"
import coinsSrc from "assets/coins.svg"
import ShopButton from "./ShopButton.vue";
import * as AllSpells from "@/components/spells/spells"
import useSpellData from "@/components/spells/useSpellData"
import { computed, onMounted ,ref,toValue,watchEffect} from "vue";

const emit = defineEmits(["shop-opened","shop-closed","spell-bought","heal-bought","health-bought","mana-bought","mana-regen-bought","spend-money"])
const props = defineProps({
  money:{
    type:Number,
    required:true
  },
  currentHealth:{
    type:Number,
    required:true
  },
  maxHealth:{
    type:Number,
    required:true
  },
  spellsOnHand:{
    type:Array,
    required:true
  },
  shopVisible:{
    type:Boolean,
    required:true
  },
})

const selectedSpell = ref({})
const spells_not_on_hand_data = computed(()=>{
  const allSpellNames = Object.values(AllSpells).map(item => item.__name);
  const spells_not_on_hand_names = [...new Set(allSpellNames)].filter(name => !props.spellsOnHand.includes(name));
  const spells_not_on_hand_data = spells_not_on_hand_names.map(spellName =>getSpellNameData(spellName)).filter(spellData => spellData != undefined )
  return spells_not_on_hand_data
})


onMounted(()=>{
  // console.log(spells_not_on_hand_data.value);
})

function selectSpellToBuy(spellData) {
  selectedSpell.value = spellData
}
function getSpellNameData(spellName) {
  const dataFunctionName = "get" + spellName + "Data"
  if (useSpellData[dataFunctionName] == undefined) return
  return useSpellData[dataFunctionName]()
}

function buySelectedSpell() {
  const boughtSpell = toValue(selectedSpell)
  if (boughtSpell.damage == undefined) {
    console.log("no spell to buy");
    return
  }
  if (props.money < boughtSpell.price) {
    console.log("u 2 poor");
    return
  }

  const price = boughtSpell.price
  if (typeof price !== "number") {
    console.error("spell has no price :",boughtSpell)
  }
  emit("spend-money",price )
  emit("spell-bought",boughtSpell)
// reset selected spell
  selectedSpell.value = {}
}
function buyHealth(price) {
  if (props.currentHealth == props.maxHealth) return

  emit("spend-money",price )
  emit("heal-bought",25)
}
function buyMaxHealth(price) {
  emit("spend-money",price )
  emit("health-bought",10)
}
function buyManaCapacity(price) {
  emit("spend-money",price )
  emit("mana-bought",10)
}
function buyManaRegenRate(price) {
  emit("spend-money",price )
  emit("mana-regen-bought",0.714)
}
</script>

<style scoped>
.cofirm-price{
  font-size: 12px;
}
.shop-spell{
  font-size: 8px;
  letter-spacing: 0px;
}
.shop-header{
  font-size: 40px;
}
.bonuses-container{
  font-size: 18px;
}

.spell-description{
  font-size: 14px;
  letter-spacing: -1px;
  padding: 0.5em;
  border: 1px solid white;
  flex-grow: 9;
}
.spell-stats{
  margin-top: auto;
  font-size: 12px;
}


</style>