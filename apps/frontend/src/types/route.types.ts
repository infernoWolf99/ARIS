import type { LucideIcon } from "lucide-react"
import type { ComponentType } from "react"

export type RouteItemType = {
  title: string
  path: string
  element: ComponentType
  icon: LucideIcon
  index?: boolean
}
