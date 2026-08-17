// this component is an implementation for a custom tooltip with lucide react icons

import type { TooltipTypes } from "@/types/tooltip.types"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const CustomTooltip: React.FC<TooltipTypes> = (props: TooltipTypes) => {
  return (
    <Tooltip>
      <TooltipTrigger render={props.trigger} />
      <TooltipContent>{props.content}</TooltipContent>
    </Tooltip>
  )
}

export default CustomTooltip
