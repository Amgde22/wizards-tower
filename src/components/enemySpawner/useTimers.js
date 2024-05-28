import { watch } from "vue"
import tickTimers from "../../stores/secondsInTicks"
export default function useTimers(props) {
  
  function everySecond(callBack) {

    return watch(props , ()=>{
      if (props.tick % tickTimers.oneSecond == 0){
        callBack()
      }
    })
  }

  function everyHalfSecond(callBack) {


    return watch(props , ()=>{
      if (props.tick % tickTimers.halfSecond == 0){
        callBack()
      }
    })
  }

  function everyTwoSeconds(callBack) {

    return watch(props , ()=>{
      if (props.tick % tickTimers.twoSeconds == 0){
        callBack()
      }
    })
  }
  
  
  
  return{
    everySecond,
    everyHalfSecond,
    everyTwoSeconds,
  }
}