import { Separator } from "@/components/ui/separator"
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar"
import AvatarImg from "../assets/avatar0.png"
import CustomTooltip from "./custom/custom-tooltip"
import { Bell, Settings } from "lucide-react"
import { SidebarTrigger } from "./ui/sidebar"

export function SiteHeader() {
  return (
    <header className="global-pad group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height flex h-(--header-height) w-full shrink-0 flex-row items-center justify-between gap-2 border-b bg-secondary text-primary transition-[width,height] ease-linear">
      {/* left side of header  */}
      <div className="flex flex-row place-items-center space-x-5">
        <SidebarTrigger className="-ml-1" />
        <span className="text-2xl font-black shadow-2xl">ARIS</span>
        <Separator orientation="vertical" />
      </div>
      {/* right side of header  */}
      <div className="flex flex-row place-items-center space-x-4">
        <CustomTooltip
          content="Notification"
          trigger={<Bell className="icon-hover" />}
        />
        <CustomTooltip
          content="Settings"
          trigger={<Settings className="icon-hover" />}
        />

        <CustomTooltip
          content="Profile"
          trigger={
            <Avatar className="cursor-pointer hover:scale-110">
              <AvatarImage src={AvatarImg} />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
          }
        />
      </div>
    </header>
  )
}
