# add a spell
- add spell data in usespelldata , it has to be the EXACT name of the spell 
- copy boilerplate from most similar spell
- define emits , props 
- choose a position x and y movers
- define styles object

- most likely you'll need to add this next:
```js
OnCollisionWithEnemy(props,{position_x,position_y,...spellData},(enemyRef)=>{
  // automatically adds enemy to hitEnemiesRefs :)

  if(spellData.pierce.value <= 0) return // no splash damage
  enemyRef.getHit( toValue(spellData.damage) )
  spellData.pierce.value--
})

OnPierceDepleated(spellData.pierce,()=>{
  // disappear if no pierce left 
  emit('disappear', props);
})
```

- add any logic like: onMounted ect...
