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
import ClientRoutes from "@/lib/routes"
import { Avatar, AvatarImage } from "./ui/avatar"
import { AvatarFallback } from "./ui/avatar"
import Logo from "../assets/logo.jpeg"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-20 data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <Avatar size="lg">
                <AvatarImage src={Logo} />
                <AvatarFallback>GHS</AvatarFallback>
              </Avatar>
              <p className="text-base font-semibold text-wrap wrap-anywhere">
                Antenatal Records and Information System
              </p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ClientRoutes} />
      </SidebarContent>
    </Sidebar>
  )
}
