import { computed, ref, toValue, watch, watchEffect } from "vue"
import tickTimers from "./stores/secondsInTicks"
export const field_start = 0
export const field_width = 889
export const field_height = 474
const default_movement_speed = 5


// enemy stuff
export function usePositionStyle(position_x,position_y,hitbox_width=100,hitbox_height=100){

const width = toValue(hitbox_width)
const height = toValue(hitbox_height)
const styleObject = computed(() => {
  return {
    left:`${toValue(position_x)}px`,
    top:`${toValue(toValue(position_y))}px`,
    width:`${width}px`,
    height:`${height}px`,
  }
})

return styleObject
}


// movement                
// export function useMovementManager(props,y_positioner,{isFrozen},{movementSpeed,isGrounded,initial_x,initial_y}) {

export function useMovementManager(props,y_positioner,enemy,enemyData) {

  // defaults
  enemyData.movementSpeed ??= default_movement_speed
  enemyData.initial_x ??= field_width
  enemyData.isGrounded ??= false

  const isMovingX = computed(() => {
    return !toValue(enemy.isFrozen)
  }) 

  const position_x = useMoveToLeft(props ,enemy, enemyData)
  const position_y = y_positioner(props, { position_x, ...enemy }, enemyData);


  //  all refs
  return {
    position_x,
    position_y
  }
}


  export function useMoveToLeft(props,enemy,{movementSpeed ,initial_x,isGrounded}){
    const x = ref(initial_x)

    watch(props, ()=>{
      // frozen enemies on the ground stop moving
      if (enemy.isFrozen && isGrounded ) return

      x.value -= toValue(movementSpeed)
    })

    return x
  }

  export function useMoveToRight(props,isMovingX,{movementSpeed = 15,initial_x = field_start}){
    const x = ref(initial_x)
    watch(()=>props.tick, ()=>{
      if (isMovingX.value == false) return

      x.value += movementSpeed
    })

    return x
  }

  export function useFrozenMoverY(props,position_y) {
    return ref(field_height - 100)
    const y = ref( toValue(toValue(position_y)) )
    watch(props,()=>{
      y.value -= 12
    })
    return y 
  }

// spawn

export function useSpawnFlying(props,{isFrozen},{initial_y}) {
  const distance_from_field_top = 200
  const top_padding = 20 // enemies won't spawn touching the top border
  const minimum_y = Math.max( 
    top_padding ,
    Math.random() * distance_from_field_top 
  )
  const y = ref(minimum_y)

  if (toValue(isFrozen)) {
    console.log("i got frozen nooo-*cling*" , isFrozen.value);
  }

  return y
}

export function useSpawnEvasiveFlying(props,{position_x,isFrozen},{initial_y,hitbox_height}) {
  const distance_from_field_top = 250
  const top_padding = 50 // enemies won't spawn touching the top border
  const minimum_y = Math.max( 
    top_padding ,
    Math.random() * distance_from_field_top 
  )
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
          field_height - hitbox_height,
        Math.max(
          minimum_y + Math.cos(position_x.value / curving_speed_modifier ) * curve_size_modifier * direction_modifier,
          field_start
        )
      )
  })
  return y
}


export function useSpawnGrounded() {
  const distance_from_field_top = 200
  const top_padding = 50 // enemies won't spawn touching the top border
  const minimum_y = Math.max( 
    top_padding ,
    Math.random() * distance_from_field_top 
  )
  const y = ref(minimum_y)
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






export function useEnemy(props,{name,health,movementSpeed,damage,emit,entityId}) {
  const die = defineDie({emit,entityId})
  const {isDead,getHit} = defineGetHit({health,killEnemy:die})
  const {isFrozen,getFrozen} = defineGetFrozen(props)
  const enemy = {
    die,
    isDead,getHit,
    isFrozen,getFrozen,
  }
  return enemy
}


  export function defineDie({emit,entityId}) {
    const die = ()=>{
      emit("enemyDied",entityId.value)
    }
    return die
  }


  export function defineGetHit({health , killEnemy}) {

    const isDead = ref(false)
    const getHit = (damage)=>{
      console.log("%cEnemy got hit", "color: red");
      health.value -= damage
    }
    watch(health , ()=>{
      if (health.value <= 0) {
        isDead.value = true
        killEnemy()
      }
    })
    return {isDead,getHit}
  }


  export function defineGetFrozen(props) {
  let is_frozen = ref(false)
  const internalFreezeTicks = ref(0)
  const freeze_stacks = ref(0)

    const getFrozen = (freeze_strength = 1)=>{
      freeze_stacks.value += freeze_strength
    }

    watch(props,()=>{
      internalFreezeTicks.value++
    })
    watch(internalFreezeTicks,()=>{
      // every half a second , if freeze_stacks more than 0 , decrease freeze
      if (internalFreezeTicks.value % tickTimers.oneSecond_andHalf == 0 && 
      freeze_stacks.value > 0 ) {
        freeze_stacks.value -= 1
      }
    })
    watch(freeze_stacks,()=>{
      if (freeze_stacks.value > 0) {
        is_frozen.value = true
      }
      else {
        is_frozen.value = false
      }
    })
    return {
      isFrozen:is_frozen,
      getFrozen
    }
  }





// watchers

export function onReachedBase(position_x,callback){
  watch(position_x,()=>{
    if (position_x.value <= field_start) {
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
            alreadyHitEnemyIds.value.push(enemyRef.entityId.value);
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

export function afterHalfSecond(props,callback) {

  const ticksPassed = ref(0)
  const stopWatch = 
  watch(props , ()=>{
    ticksPassed.value++
    if (ticksPassed.value % tickTimers.halfSecond == 0) {
      // console.log("getCalled back");
      // console.log({
      //   ticksPassed:ticksPassed.value,
      //   timer:tickTimers.halfSecond
      // });
      callback() 
      stopWatch()
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
