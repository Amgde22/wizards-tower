import { computed, isRef, ref, toValue, watch, watchEffect } from "vue"
import uniqid from "uniqid"
import tickTimers from "./stores/secondsInTicks"
import hit1 from "assets/sounds/hit1.mp3"
import hit2 from "assets/sounds/hit2.mp3"
import hit3 from "assets/sounds/hit3.mp3"


export const field_start = 0
export const field_width = 889
export const field_height = 474
const default_movement_speed = 5


// enemy stuff
export function usePositionStyle(position_x,position_y,hitbox_width=100,hitbox_height=100,isFlashing){

const width = toValue(hitbox_width)
const height = toValue(hitbox_height)
const styleObject = computed(() => {
  return {
    left:`${toValue(position_x)}px`,
    top:`${toValue(position_y)}px`,
    width:`${width}px`,
    height:`${height}px`,
    border:toValue(isFlashing)?"1px solid white":undefined
  }
})

return styleObject
}


// movement                
export function useMovementManager(props,y_positioner,enemy,enemyData,x_positioner) {

  // defaults (if i forget to define them them) // not good , needs typescript
  enemyData.movementSpeed ??= default_movement_speed
  enemyData.initial_x ??= field_width

  // slightly randmize movement speed so enemies don't look robotic
  chnageMovementSpeed(enemyData)

  const isGrounded = ref(false)
  const isStopedX = computed(() => {
    return (toValue(enemy.isFrozen) && toValue(isGrounded)) 
  }) 

  const position_x = useMoveToLeft(props ,enemy, enemyData,isStopedX)
  const backup_position_y = ref(enemyData.initial_y)
  const position_y_calculator = ref()
  const position_y = ref(enemyData.initial_y )

  // watchEffect(()=>{
    watch(enemy.isFrozen,()=>{
    // enemy is frozen
    if (toValue(enemy.isFrozen)) {
      position_y_calculator.value = useFrozenMoverY(props, { position_x, ...enemy }, enemyData, backup_position_y.value)
    }
    // enemy is normal
    else { 
      const normal_y_positioner = y_positioner(props, { position_x, ...enemy }, enemyData, backup_position_y.value);
      position_y_calculator.value = normal_y_positioner
      backup_position_y.value = normal_y_positioner.value
    }
  }, {
    immediate: true
  })
  
  const groundedY = getEnemyDataGroundedY(enemyData)
  watchEffect(()=>{
    position_y.value = position_y_calculator.value?.value
    if (position_y.value < groundedY) {isGrounded.value= false}
    else {isGrounded.value = true}
  })


  //  all refs
  return {
    position_x,
    position_y
  }
}
function chnageMovementSpeed(enemyData) {
  const movement_speed_is_ref = isRef(enemyData.movementSpeed)
  const random_value = Math.round(  (Math.random() * 4) - 2  ) // between -2 and +2
  if (movement_speed_is_ref) {
    enemyData.movementSpeed.value += random_value
  }
  else{
    enemyData.movementSpeed += random_value
  }
  
}

  export function useMoveToLeft(props,enemy,{hitbox_width,movementSpeed ,initial_x,x_distance},isStopedX){
    const x = ref(initial_x)
    const {isKnockedBack,isHypnotized} = enemy
    watch(props, ()=>{
      // stunned enemy logic
      if (toValue(isStopedX)) return 

      // enemies that stop midway logic
      if  (x_distance) {
        if (
          x.value <= (field_width - toValue(x_distance)) 
          ) return
        // x_distance.value -= toValue(movementSpeed)
      }

      // knock back logic
      if (toValue(isKnockedBack) != false) {
        x.value += 25 // get knowcked back
        isKnockedBack.value -= 25 
        return
      }
      // hypnotized enemy movement logic / dehypnotized logic
      if (toValue(isHypnotized)) {
        x.value += toValue(movementSpeed)
          if (x.value >= field_width - hitbox_width) {
            enemy.getDehypnotized()
          }
        return
      }
      // normal moving enemy logic
      x.value -= toValue(movementSpeed)
    })

    return x
  }

  export function useMoveToRight(props,isMovingX,{movementSpeed = 15,initial_x = field_start}){
    const x = ref(initial_x)
    watch(()=>props.tick, ()=>{
      if (toValue(isMovingX) == false) return

      x.value += movementSpeed
    })

    return x
  }


// spawn

export function useSpawnFlying(props,enemy,{initial_y},previous_position_y) {
  const flying_y = getFlyingEnemyInitialY()
  const y = ref(previous_position_y ?? initial_y ?? flying_y)
  return y
}

export function useSpawnEvasiveFlying(props,{position_x,isFrozen},{initial_y,hitbox_height},previous_position_y) {
  const minimum_y = previous_position_y ?? initial_y ??  getFlyingEnemyInitialY()
  const curve_size_modifier = 60
  const curving_speed_modifier = Math.max( 
    30 ,
    Math.random() * 70 
  )
  const direction_modifier = Math.random() > 0.5 ? 1 : -1;
  const y = ref(minimum_y)
  watch(position_x,()=>{
    y.value = 
      Math.min(
          field_height - hitbox_height, // groundedY
        Math.max(
          minimum_y + Math.cos(position_x.value / curving_speed_modifier ) * curve_size_modifier * direction_modifier,
          field_start
        )
      )
  })
  return y
}

  export function useFrozenMoverY(props,enemy,{initial_y,hitbox_height},previous_position_y) {
    const ceiling_y = getFlyingEnemyInitialY()
    const y = ref(previous_position_y ?? initial_y ?? ceiling_y)
    const grounedY = field_height - hitbox_height
    const falling_speed = ref(0)
    watch(props,()=>{
      if (y.value == grounedY) return
      y.value += falling_speed.value
      falling_speed.value += 3

      if (y.value > grounedY ) {y.value = grounedY}
    })
    return y 
  }



export function useSpawnGrounded(props,enemy,{initial_y,hitbox_height},previous_position_y) {
  const groundedY = field_height-hitbox_height
  const y = ref(previous_position_y ?? initial_y ?? groundedY)
  return y
}




// functionality
export function useSpawnEnemyAtCurrentPosition(emit,enemy,position_x,position_y,enemyData) {
  const enemyIsString = typeof enemy == "string"
  const enemyIsObject =typeof enemy.forEach == "undefined" && !enemyIsString  
  const enemyIsArray = typeof enemy.forEach == "function"
  let random_additional_x = 0
  let random_additional_y = 0

  if (enemyIsString) {
    if(enemyData){
      random_additional_x = (Math.random() * enemyData.hitbox_width / 2) + enemyData.hitbox_width / 2
      random_additional_y = (Math.random() * enemyData.hitbox_height ) - enemyData.hitbox_width / 6
    }
  
    emit("newEnemy",{
      name:enemy,
      initial_x:toValue(position_x) + random_additional_x ,
      initial_y:toValue(position_y) + random_additional_y ,
    })
  }
  else if(enemyIsObject){
    emit("newEnemy",enemy)
  }
  else if(enemyIsArray){
    enemy.forEach(enemyName=>{
      useSpawnEnemyAtCurrentPosition(emit,enemyName,position_x,position_y,enemyData)
    })
  }

}






export function useEnemy(props,{name,health,movementSpeed,damage,emit,entityId,sounds}) {

  const fieldId = toValue(entityId)
  const {isDead,getHit,die} = defineGetHit({health,emit,fieldId})
  const {isFrozen,getFrozen,GetUnFrozen} = defineGetFrozen(props)
  const {isKnockedBack,getKnockedBack} = defineGetknockedBack()
  const isFlashing = defineHitflash(props,health)
  const {isHypnotized,getHypnotized,getDehypnotized} = defineGetHypnotized(props,health)
  
  playSoundOnHealthDecrease(health,sounds)

  const enemy = {
    die,
    isDead,getHit,
    isFrozen,getFrozen,GetUnFrozen,
    isKnockedBack,getKnockedBack,
    isHypnotized,getHypnotized,getDehypnotized,
    isFlashing,
  }
  return enemy
}


  export function defineGetHit({health , emit , fieldId}) {
    const isDead = ref(false)
    const die = ()=>{
      isDead.value = true
      emit("enemyDied",fieldId)
    }
    const getHit = (damage)=>{
      console.log("%cEnemy got hit", "color: red");
      health.value -= damage
        if (health.value < 0) {health.value= 0} // health always positive
    }
    watch(health , ()=>{
      if (health.value <= 0) {
        isDead.value = true
        die()
      }
    })
    return {isDead,getHit,die}
  }


  export function defineGetFrozen(props) {
    const maxStacks = 10
    const ticksPerStack = tickTimers.halfSecond
    const [isFrozen, getFrozen,GetUnFrozen]= defineStackedEffect(props,{maxStacks,ticksPerStack})
    return {
      isFrozen,
      getFrozen,
      GetUnFrozen
    }
  }
  function defineGetHypnotized(props,health) {
    const maxStacks = 2
    const ticksPerStack = tickTimers.tenSeconds
    const [isHypnotized,getEffected,getDehypnotized] = defineStackedEffect(props,{maxStacks,ticksPerStack})
    const getHypnotized = ()=>{
      getEffected(1)
    }
    return {
      isHypnotized,getHypnotized,getDehypnotized
    }
  }



function defineStackedEffect(props,{maxStacks,ticksPerStack}) {
  const internalTicks = ref(0)
  const stacks = ref(0)
  const isEffected = computed(()=>stacks.value>0?true : false)

  watch(props, () => {
    if (isEffected.value == false) return // only count when effect is in place
    internalTicks.value++
    // console.log("more tickssss:",internalTicks.value ,"/", ticksPerStack); // check - onlu on effect
  })

  watch(internalTicks, () => {
    // pass in ticktimer.x , reduce stacks every x seconds
    if (internalTicks.value % ticksPerStack == 0 && 
      stacks.value > 0) {
        // console.log("reducing stacks from",stacks.value,"to",stacks.value - 1);
        stacks.value -= 1
    }
  })

  const getEffected = (effectPower)=>{
    stacks.value += effectPower
    if (stacks.value > maxStacks) stacks.value = maxStacks
  }
  
  const getUnEffected = ()=>{
    stacks.value = 0
  }

  // reset internal ticks when effect is gone
  watch(isEffected,(newVal,oldVal)=>{
    if (newVal== false && oldVal == true) {
      internalTicks.value = 0
    }
  })

  return [isEffected,getEffected,getUnEffected]
}


function defineHitflash(props,healthRef){
  const isFlashing = ref(false)
  watch(healthRef , (new_health_value , old_health_value)=>{
    if(new_health_value < old_health_value){
      isFlashing.value = true
      afterHalfSecond(props,()=>{
        isFlashing.value = false
      })
    }
  })
  return isFlashing
}




function defineGetknockedBack() {
  const isKnockedBack = ref(false) // tells moveToLeft if it shoul knock enemy back
  const getKnockedBack = (value)=>{ // get knocked back by value (pixels)
    if (isKnockedBack.value == false) {
      isKnockedBack.value = toValue(value)
    }
    else {
      isKnockedBack.value += toValue(value)
    }
    
  }
  watch(isKnockedBack,(knockBack_value)=>{
    if (typeof knockBack_value != "number") return
    if (knockBack_value <= 0) {
      isKnockedBack.value = false // automatic reset
    }
  })
  return {
    isKnockedBack,
    getKnockedBack
  }
}

// function defineGetGuarded() {
//   const Guarded_position_x = ref(false) 
//   const getGuarded = (position_x)=>{ // get knocked back by value (pixels)
//     watch(position_x , ()=>{

//     })
//   }
//   watch(isKnockedBack,(knockBack_value)=>{
//     if (typeof knockBack_value != "number") return
//     if (knockBack_value <= 0) {
//       isKnockedBack.value = false // automatic reset
//     }
//   })
//   return {
//     isKnockedBack,
//     getKnockedBack
//   }
// }

const playSoundOnHealthDecrease = (health, sounds = [hit1,hit2,hit3]) => {
  watch(health, (newVal, oldVal) => {
    if (newVal >= oldVal) return // only play if health decreases
    const random_sound = sounds[Math.floor(Math.random() * sounds.length)]
      const audio = new Audio(random_sound);
      audio.playbackRate = Math.random() + 0.5; // between 0.5 and 1.5 speed
      audio.volume = 0.4
      audio.play();
  });
};


// watchers

export function onReachedBase(position_x,callback){
const forgivness_value = 35
  watch(position_x,()=>{
    if (position_x.value <= field_start - forgivness_value) {
      callback()
    }
  })
}

export function onReachedEnd({position_x,hitbox_width},callback){
  watch(position_x,()=>{
    if (position_x.value  >= field_width - hitbox_width) {
      callback()
    }
  })
}

export function onGetHit(health,callback) {
  watch(health , (newVal,oldval)=>{
    if (newVal < oldval) {
      callback(newVal,oldval)
    }
  })
}

export function onDie(enemy,callback) {
  watch(enemy.isDead , ()=>{
    if (enemy.isDead.value == true) {
      callback()
    }
  })
}

export function useChangeEntityId(props,entityId){
  const newEntityId = ref(toValue(entityId))
  watch(()=>props.tick , ()=>{
    newEntityId.value = uniqid()
  })
  return newEntityId
}
// useMakeEnemy
export function useMakeEnemyAbsorbPierce(props,enemy,enemyData){
  watch(()=>props.tick , ()=>{
    if (toValue(enemy.isFrozen) && toValue(enemy.isHypnotized)) return
    enemyData.entityId.value = uniqid()
  })
}
export function giveEnemyKnockbackImmunity(enemy){
  enemy.getKnockedBack = ()=>{
    // nothing
  }
}
// spells watchers

export function OnCollisionWithEnemy(props,{position_x,position_y,hitbox_width,hitbox_height,pierce,damage,alreadyHitEnemyIds},callback,params) {
  const preventDefaultEnabled = params?.preventDefault == true
  watch([props,alreadyHitEnemyIds],()=>{
    props.enemiesOnFieldRefs.forEach((enemyRef,index) => {
      const enemyId = enemyRef.entityId
      const enemyGotHit = alreadyHitEnemyIds.value.includes(enemyId)
      if (enemyGotHit) return // enemy already hit

      const spellCollidesWithEnemy = checkCollision({position_x,position_y,hitbox_width,hitbox_height},enemyRef,index)
        if (spellCollidesWithEnemy) { 
          if(preventDefaultEnabled == false){
            alreadyHitEnemyIds.value.push(enemyId);
          }
        callback(enemyRef)
        }
    })
  })
}
    function checkCollision(spellData,enemyRef,index) {
      const spell = {
        
        x:toValue(spellData.position_x),
        y:toValue(spellData.position_y),
        width:spellData.hitbox_width,
        height:spellData.hitbox_height,
      }
      const enemy = {
        x:toValue(enemyRef.position_x),
        y:toValue(enemyRef.position_y),
        width:enemyRef.hitbox_width,
        height:enemyRef.hitbox_height,
      }
      // console.log(spell,enemy);
      const doesCollide = spell.x < enemy.x + enemy.width && 
                        spell.x + spell.width > enemy.x &&
                        spell.y < enemy.y + enemy.height &&
                        spell.y + spell.height > enemy.y 

      return doesCollide
    }

export function OnPierceDepleated(pierce , callback)  {
  watch(pierce , ()=>{
    if (pierce.value <= 0) {
      callback()
    }
  })
}


// After Tick timer

export function afterTenthSecond(props,callback) {
  const ticksPassed = ref(0)
  const stopWatch = watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.tenthSecond == 0) {
      callback() 
      stopWatch()
    }
  })
  
}


export function afterFixthSecond(props,callback) {
  const ticksPassed = ref(0)
  const stopWatch = watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.fifthSecond == 0) {
      callback() 
      stopWatch()
    }
  })
}
export function everyFifthSecond(props,callback) {
  const ticksPassed = ref(0)
    watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.fifthSecond == 0) {
      callback() 
    }
  })
}

export function afterHalfSecond(props,callback) {

  const ticksPassed = ref(0)
  const stopWatch = 
  watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.halfSecond == 0) {
      callback() 
      stopWatch()
    }
  })
}
export function everyHalfSecond(props,callback) {

  const ticksPassed = ref(0)
  watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.halfSecond == 0) {
      callback() 
    }
  })
}

export function afterOneSecond(props,callback) {
  const ticksPassed = ref(0)
  const stopWatch = watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.oneSecond == 0) {
      callback() 
      stopWatch()
    }
  })
}

export function afterTwoSeconds(props,callback) {
  const ticksPassed = ref(0)
  const stopWatch = watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.twoSeconds == 0 ) {
      callback() 
      stopWatch()
    }
  })
}

export function everyTwoSeconds(props,callback) {
  const ticksPassed = ref(0)
  const stopWatch = watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.twoSeconds == 0 ) {
      callback() 
    }
  })
}

// utils
function getFlyingEnemyInitialY() {
  const distance_from_field_top = 200
  const top_padding = 20 // enemies won't spawn touching the top border
  const flying_y = Math.max( 
    top_padding ,
    Math.random() * distance_from_field_top 
  )
  return flying_y
}
export function getEnemyDataGroundedY(enemyData) {
  return field_height - enemyData.hitbox_height
}