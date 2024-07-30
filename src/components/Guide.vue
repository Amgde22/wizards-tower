<template>
  <div :class=" {'op': props.spellsOnField.length >= 1 }" class="guide absolute inset-0 p-6">
    <p class="title underline -mx-2">How To play :</p>
    <ul>
      <li class="note">Click or Drag your <span class="orange">spells</span> on the bottom to place them</li>
      <li class="note">placing <span class="orange">spells</span> costs <span class="blue">mana</span> (<span class="blue">mana</span> <span class="green">regenerates</span> over time)</li>
      <li class="note">use your <span class="orange">spells</span> to defend your tower
        (<img class="icon" :src="whiteTowerSrc" alt="" />)
      </li>
      <li class="note">click the shop button on the top right to open the <span class="yellow">shop</span></li>
      <li class="note">use your money to buy more <span class="orange">spells</span> or <span class="green">increase</span> your stats</li>
      <!-- <li class="note">Q : puase game</li> -->
      <!-- <li class="note">[1-8] : quick Spell select </li> -->
    </ul>
  </div>
</template>

<script setup>
import whiteTowerSrc from 'assets/white-tower.svg';
import { onMounted } from 'vue';

const props = defineProps({
  spellsOnField: {
    type: Array,
    required: true
  }
});
// onMounted(()=>{
//   console.log(props.spellsOnField.le);
// })
</script>



<style  scoped>
.op {
  opacity: 0.3;
}
.blue{
  color:#3b82f6;
}
.green{
  color: #22c55e;
}
.orange{
  color: #f97316;
}
.yellow{
  color: #eab308
;
}
.title{
font-size: 1.2rem;
letter-spacing: -1px;

}
ul{
  margin-top: 0.4em;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}
.note{
  font-size: 0.8rem;

}
li::before {
  content: '•'; /* Ajoute une puce */
  color: rgb(237, 116, 116); /* Change la couleur de la puce */
  padding-right: 0.5em; /* Espace entre la puce et le texte */
}
img{
  display: inline !important;
}
</style>