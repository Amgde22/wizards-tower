

### components
navbar {
  health
  score
  setting:[time , ...]
}

castle {
  just a hitbox
}

field {
  enemies spawn outside and slide in
  speed : every (unit of time:global) move by speed
}

spells{
  spells are objects , and won't be a component untill you spawn them by clicking on them then clicking on the field

  when a spell element intersects with an enemy element:
    apply something from the spell (object) to the enemy (object) , it should have a unique id so it doesn't retrigger the next frame

}

<!-- how to check for collisions -->

- each spell component is given the list of ALL enemies on the field {x:000 , y:000}
- inside spell component each tick check if im colliding with any enemy (do something unique , eg:disapear , explode)
- on collision emit an event enemy-collision({
  enemy: enemy we collided with
  events:[
    {event , arg},
    {event , arg},
    {event , arg}
  ]
})
- now we need to command the enemy component something (take damage , get frozen ...ect)


climb up from spell to get to enemy ref , call a function on event [to-do]
- when intersect get id of enemy who intersect me
- get EnemyField.$refs.enemies
- filter enemies with said id
- we have our component 
- call a function on it
BUTCHHHHHHH



Enemy 
when an evemy property gets changed like isDead we want to set a onDead watcher

other stuff like isFrozen should be automatically watched inside use enemy

# enemy spawner
if have a function that gats called if tick % 20 == 0
(which equates to every 1 second if tick is being updated every 50ms)

we have a level 
- each level is an array of :
  - arrays of grouped enemies
so level =[  [beggining] ,   [midlevel enemies]   , [end of level enemies]   ]

this is so we guarantee we won't spawn anything too crazy too early

      - each array of grouped enemies can be a subgroup so we span multiple enemies together
      
      midlevel enemies = [bat , [bat,goblin] , bat]
      (bat and goblin spawn at the same time here)

## enemies on field 
```javascript

enemiesOnField = {
  [j3]:{
    name:"bat",
    id:"j3"
  } // one enemy
}
```
when enemy #j3jdj3 dies it emits so we :
delete enemiesOnField[j3]

### enemies on field : multiple enemies in one component

```javascript
enemiesOnField = {
  [j3] :{
    name:"bat",
    id:"j3"
  } // one enemy

  [k3] :{
    name:"goblin",
    initial_x:something,
    initial_y:something,
    id:"k3",
  }
}
}

// we use this to spawn k3
const k3 = useSpawnEnemy(name,{initial_x,initial_y})
```
here j3 spans k3
so j3 emits an event that k3 spawned and it gets added to enemiesOnField[k3]

enemy #j3 must be a killable enemy , so as #k3
each time one of them dies we remove thier id from

### enemy spawner
useLevel has timers
level1 = {timers , enemyGroups} (both array)
- NOTE : levelX is not reactive - we might even clone it

so big EnemySpawner.vue does this :
- get current level object from use levels , using a function so we can clone level
(now we have level1 = {timers , enemyGroups})
- get timers[0] which corresponds to enemyGroups[0]

- call the timer with a callback function(){
  get first enemy ("") / enemies ([]) from **level1.enemyGroups[x][0].splice/slice** idk
  
- for every enemy we have 1 or more:  emit("newEnemy" , **{name:enemy , id:uniqueId}** )
(now we are slowly removeing enemies from the **current** enemyGroup )
##### find a way to stop watching for thia function
} callback end

- when enemyGroup is **empty we slice it** if there are timers left ,**we slice current timer too!**
else : call the same timer but with a callback that gets current enemygroup

- when no enemy groupsleft - the level is won and we emit an event for that , this composable is not responsible for increasing levels









### spell placer
what we have : 
- all spell components
- filter spell components to only include current spell (use name property of a component)

what we need : filtered spell components that know which spell they spawn , which area it can spawn on , spell cooldown , spell mana cost
- these can be dragged
- if the place is right , add spellOnField(...{spell,spawndata})

### steps
resize spell field , spell placer , castle , spellfield now BIG
and castle is just a tower now - done

add placeSection , color  - done

iterate through spellOnHandNames and render a placerComponent for each one
  - get spellData : get + "spellName" + data - done
    - if it doesn't exist console.warn("couldn't find spell data of:" , spellData) - done
  - drag element is a draggable box , border is spellData.color  , if there is an icon , go to assets/icon , no icon ? do a question mark - done
  - when spell is clicked / draged emit a selected event(spellData) , spell placer class is changed to spellData.placeSection
  - and that selected spell is removed on drag_end ,spell placed, or when you click on , spellFIeld , spellmenu,body 







# todo
mana system : - done
  - pretty up mana bar , make it an actual bar
  - show me how much mana i will consume and how much ill be left with (maybe only the latter) - done
  add dev mode - no cooldown , infinite mana -deon

  Freeze : - this one will be hard
x problems : code sux , replace stack removal with ticks , movers need to know when freeze is activated

  (enemy keeps momentum (flying only) which allows player to do tricks with knockback)
  - hitting an eveny with freeze inflict isFrozen
  - when is frozen enemies either:
  stop flying : go down , when hit walking enemy or ground , take damage , die or go back
  stop walking : self explanatory


  - code freeze (last spell before i show hicham)



- add more spells , thunder and freeze , tripple twister
- add more enemies goblin , summoner , golem(slow and tanky) , 


- after some content make a mana and health system 
- death and game over and restart (probably just refresh to restart cuz who cares)
- publish

add icon to spellData
add icons to assets
make spells load thier icon
add placeSection , color , icon to spellData