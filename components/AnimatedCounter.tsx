import CountUp from "react-countup"

const AnimatedCounter = ({amount}:{amount:number}) => {
  return (
      <CountUp end={amount} decimal="." decimals={2} prefix="₹" />
  )
}

export default AnimatedCounter
