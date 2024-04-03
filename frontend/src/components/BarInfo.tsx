import { barMenuInfo } from "../types/types"

interface Props { 
    barData: barMenuInfo[];
}

const BarInfo = ({barData}:Props) => {
    console.log(barData)
  return (
    <div>BarInfo</div>
  )
}

export default BarInfo