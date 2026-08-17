import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Routes from "@/lib/routes"
import { Avatar } from "./ui/avatar"
import { AvatarFallback } from "./ui/avatar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! h-20"
              render={<a href="#" />}
            >
              <Avatar size="lg">
                <AvatarFallback>GHS</AvatarFallback>
              </Avatar>
              <p className="text-base font-semibold text-wrap wrap-anywhere ">
                Antenatal Records and Information System
              </p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={Routes} />
      </SidebarContent>
    </Sidebar>
  )
}
