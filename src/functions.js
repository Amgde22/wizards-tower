import useSpellData from "./components/spells/useSpellData";
import hit1 from "assets/sounds/hit1.mp3"
import hit2 from "assets/sounds/hit2.mp3"
import hit3 from "assets/sounds/hit3.mp3"

export function getSpellDataByName(spellName) {
    const dataFunctionName = "get" + spellName + "Data"
    const spellDataFunction = useSpellData[dataFunctionName]
    if (spellDataFunction == undefined) {
      console.warn("could find spell data in useSpellData of:",spellName);
      return
    }
    const spellData = useSpellData[dataFunctionName]()
    return spellData
}

export function loadAudios(){
  const sounds = [hit1,hit2,hit3]
  sounds.forEach(sound =>{
      const audio = new Audio(sound);
      audio.volume = 0
      audio.play()
  })
}

export function getFirstLetters(string) {
  if (string == undefined) return
  return string
    .split(' ') // Split the string into an array of words
    .map(word => word.charAt(0)) // Get the first letter of each word
    .join('') // Join the letters back into a single string
    .toUpperCase();
}
