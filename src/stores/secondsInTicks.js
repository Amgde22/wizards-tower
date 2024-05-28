const tickInterval = 50 // copied value from app.vue
const one_second= 1000
const timers = {
  tenthSecond: (one_second / 10) / tickInterval ,
  fifthSecond: (one_second / 5) / tickInterval ,
  halfSecond: (one_second / 2) / tickInterval ,
  oneSecond: one_second / tickInterval,
  oneSecond_andHalf:1.5 * one_second / tickInterval,
  twoSeconds: 2 * one_second / tickInterval
}
export default timers