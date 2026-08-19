import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { RouteItemType } from "@/types/route.types"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"

export function NavMain({ items }: { items: RouteItemType[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  cn(isActive ? "bg-primary text-secondary" : "text-primary", 
                    'rounded'
                  )
                }
              >
                <SidebarMenuItem className="rounded">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="rounded"
                  >
                    <Icon />
                    <span className="font-semibold">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </NavLink>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
