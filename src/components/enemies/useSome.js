import { computed, ref, watch } from "vue";

export default function useSome(props) {
  let y = ref(props.x)


  watch(props , ()=>{
    y.value = props.x
  })
  setInterval(() => {
    y.value++
  }, 1500);

  const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
  const yarr = computed(()=>arr[y.value-1])
  return {y,yarr}
}