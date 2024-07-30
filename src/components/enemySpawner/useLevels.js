import timers from '../../stores/secondsInTicks'

export default function useLevels() {  
  const level1 = getlevel1()
  const level2 = getlevel2()
  const level3 = getlevel3()
  const level4 = getlevel4()
  const level5 = getlevel5()
  const level6 = getlevel6()
  return [level1,level2,level3,level4,level5,level6]
}
function getlevelx() {
  const levelx  = {
    section1:{
      spawnTimer:timers.oneSecond_andHalf,
      enemyComponentList:[
        "LesserBat",
      ]
    },
    section2:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        "LesserBat",
      ]
    },
    section3:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        "LesserBat",
      ]
    },
    section4:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        "LesserBat",
      ]
    },
  }
  return levelx
}

function getlevel1() {
  const level1  = {
    section1:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        "LesserBat",
      ]
    },
    section2:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        ["LesserBat","LesserBat"],
        ["LesserBat","LesserBat"],
        ["LesserBat","LesserBat","LesserBat"],
      ]
    },
    section3:{
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        ["LesserBat","LesserBat","LesserBat"],
        ["LesserBat","LesserBat"],
        ["LesserBat","LesserBat","LesserBat"],
        ["LesserBat","LesserBat"],
        ["LesserBat","LesserBat","LesserBat"],
        ["LesserBat","LesserBat"],
        ["LesserBat","LesserBat","LesserBat"],
        ["LesserBat","LesserBat","LesserBat","LesserBat"],
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
      ]
    },
    section2:{
      spawnTimer:timers.oneSecond_andHalf,
      enemyComponentList:[
        ["Bat"],
        ["LesserBat","Bat"],
        ["LesserBat","Bat"],
        ["LesserBat","Bat","Bat"],
      ]
    },
    section3:{
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        ["Bat"],
        ["Bat","Bat"],
        ["LesserBat"],
        ["LesserBat","Bat"],
        ["Bat"],
        ["Bat"],
        ["LesserBat","Bat","Bat"],
        ["LesserBat","Bat"],
        ["LesserBat"],
        ["LesserBat","Bat"],
        ["LesserBat","Bat"],

      ]
    },
    section4:{
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        ["LesserBat","Bat"],
        "Bat",
        ["LesserBat","Bat"],
        "Bat",
        ["LesserBat","Bat"],
        ["Bat"],
        ["LesserBat","LesserBat","LesserBat"],
        ["LesserBat","LesserBat"],
        "GiantBat"
      ]
    },
  }

  return level2
} 
function getlevel3() {
  const level3  = {
    section1:{
      spawnTimer:timers.oneSecond_andHalf,
      enemyComponentList:[
        "GiantBat",
        "LesserBat","LesserBat"
      ]
    },
    section2:{
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        "GiantBat",
        ["LesserBat","LesserBat","LesserBat"],
        "GiantBat",
        ["LesserBat","LesserBat","Bat","Bat"],
      ]
    },
    section3:{
      spawnTimer:timers.threeSeconds,
      enemyComponentList:[
        ["GiantBat","LesserBat"],
        ["LesserBat","LesserBat","LesserBat"],
        ["Bat"],
        ["Bat","Bat"],
        ["LesserBat","LesserBat","LesserBat"],
        ["GiantBat","Bat"],
      ]
    },
    section4:{
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        ["Bat","Bat","Bat","Bat"],
        ["LesserBat","LesserBat","LesserBat"],
        "GiantBat",
        ["LesserBat","Bat"],
        ["LesserBat","LesserBat","LesserBat"],
        "GiantBat"
        ["LesserBat","LesserBat","LesserBat"],
      ]
    },
  }
  return level3
}

// my most balenced level
function getlevel4() {
  const level4  = {
    section1:{
      spawnTimer:timers.oneSecond_andHalf,
      enemyComponentList:[
        "Goblin",
      ]
    },
    section2:{
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        "Goblin",
        ["LesserBat","LesserBat","LesserBat"],
        ["LesserBat","LesserBat"],
        ["Bat","LesserBat","LesserBat"],
        ["LesserBat","LesserBat"],
        ["Goblin","Goblin"]
      ]
    },
    section3:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        "EvasiveBat"
      ]
    },
    section4:{ // diff: perfect
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        ["EvasiveBat","EvasiveBat","EvasiveBat"],
        ["EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat"],
        ["EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat"],
        "Goblin",
        ["GiantBat"],
        "Goblin",
        ["EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat"],
        ["Goblin","EvasiveBat","EvasiveBat"],
      ]
    },
    section5:{ // diff: tight
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        ["EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat"],
        ["Goblin","Goblin"],
        ["Bat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat"],
        ["Goblin","EvasiveBat","EvasiveBat"],
        ["Bat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat"],
      ]
    },
    section6:{
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        ["Bat","Bat"],
        ["Bat","Bat","Bat"],
        "Goblin",
        ["GiantBat"],
        "Goblin",
        ["Bat","Bat"],
      ]
    },
  }
  return level4
}


function getlevel5() {
  const level5  = {
    section1:{
      spawnTimer:timers.oneSecond_andHalf,
      enemyComponentList:[
        "ShieldGoblin",
      ]
    },
    section2:{
      spawnTimer:timers.twoSeconds,
      enemyComponentList:[
        ["ShieldGoblin"],
        "ShieldGoblin",
        "Goblin",
      ]
    },
    section3:{
      spawnTimer:timers.threeSeconds,
      enemyComponentList:[
        ["ShieldBat","ShieldBat","ShieldBat"],
        ["GiantBat"],
        ["LesserBat","Bat","Bat"]
      ]
    },
    section4:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        ["EvasiveBat","EvasiveBat","EvasiveBat"],
        ["EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat"],
        ["ShieldBat","ShieldBat","ShieldBat"],
        ["LesserBat","Bat","Bat"],
        ["Bat","Bat"],
        ["Bat","Bat"],
      ]
    },
    // diff : perfect 
    section5:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        ["ShieldBat"],
        ["ShieldGoblin","ShieldGoblin"],
        ["ShieldBat"],
        ["ShieldBat"],
        ["GiantBat"],
        ["Bat","Bat","Bat","Bat"],
        ["EvasiveBat","EvasiveBat","EvasiveBat","EvasiveBat"],
        ["Bat","Bat","Bat","Bat"],
        ["GiantBat"],
        ["Bat","Bat"],
      ]
    },
    section6:{
      spawnTimer:timers.oneSecond,
      enemyComponentList:[
        ["ShieldGoblin","ShieldGoblin"],
        ["Goblin","Goblin"],
        "Bat",
        ["Goblin","Goblin","Goblin"],
        ["GiantBat"],
        ["GiantBat"],
      ]
    },
  }
  return level5
}

function getlevel6() {
  const level6 = {
    section1: {
      spawnTimer: timers.oneSecond_andHalf,
      enemyComponentList: [
        ["GiantBat", "GiantBat"],
        ["Bat", "Bat"],
        ["Bat", "Bat", "Bat"],
        ["GiantBat", "Bat"],
        ["ShieldBat", "Bat"],
        ["GiantBat", "GoblinCamp"],
        ["Bat"],
      ],
    },
    section2: {
      spawnTimer: timers.twoSeconds,
      enemyComponentList: [
        ["ShieldGoblin", "ShieldGoblin"],
        "GoblinCamp",
        ["Goblin", "Goblin"],
        ["Bat"],
        "ShieldGoblin",
      ],
    },
    section3: {
      spawnTimer: timers.twoSeconds,
      enemyComponentList: [
        "LesserBat",
        ["Goblin"],
        ["Goblin"],
        ["Goblin"],
        ["EvasiveBat", "EvasiveBat", "EvasiveBat"],
        "ShieldGoblin",
        ["Goblin"],
        ["EvasiveBat", "EvasiveBat", "EvasiveBat"],
      ],
    },
    section4: {
      spawnTimer: timers.twoSeconds,
      enemyComponentList: [
        "LesserBat",
        ["Bat", "Bat", "Bat"],
        ["GiantBat", "ShieldBat"],
        ["Bat", "Bat", "Bat"],
        "Bat",
        ["ShieldBat","Bat"],
        ["Bat",  "ShieldBat","Bat"],
        "GiantBat",
        "Bat",
        ["Goblin", "ShieldGoblin"],
        "Goblin"
    
      ],
    },
  };
  return level6;
}
