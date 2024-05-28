import { computed } from "vue";
import useTimers from "./useTimers";
import timers from '../../stores/secondsInTicks'
export default function useLevels(props) {
  const {
    everyHalfSecond,
    everySecond, 
    everyTwoSeconds
  } = useTimers(props)

  
  const level1 = getlevel1()
  const level2 = getlevel2()
  return [level1,level2]
}


function getlevel1() {
  const level1  = {
    section1:{
      spawnTimer:timers.halfSecond,
      enemyComponentList:[
        "Bat",
        ["Bat","Bat"],
        {name:"Bat"}
      ]
    },
    section2:{
      spawnTimer:timers.halfSecond,
      enemyComponentList:[
        ["Bat","Bat","Bat"],
        ["Bat","Bat"],
        ["Bat","Bat","Bat"],
      ]
    },
    section3:{
      spawnTimer:timers.halfSecond,
      enemyComponentList:[
        ["Bat","Bat","Bat"],
        ["Bat","Bat","Bat","Bat"],
        ["Bat","Bat","Bat"],
        ["Bat","Bat","Bat","Bat"],
        ["Bat","Bat","Bat","Bat","Bat","Bat","Bat"],
      ]
    }
  }

  return level1
} 



function getlevel2() {
  const level2  = {
    section1:{
      spawnTimer:timers.halfSecond,
      enemyComponentList:[
        "Bat",
        "Bat",
        ["Bat","Bat"],
        "Bat",
      ]
    },
    section2:{
      spawnTimer:timers.halfSecond,
      enemyComponentList:[
        ["Bat","Bat","Bat"],
        ["Bat","Bat"],
        ["Bat","Bat","Bat"],
      ]
    },
  }

  return level2
} 