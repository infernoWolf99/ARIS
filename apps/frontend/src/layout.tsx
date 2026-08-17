import { Bell, Settings } from "lucide-react"
import { Avatar } from "./components/ui/avatar"
import { Separator } from "./components/ui/separator"
import { AvatarImage } from "./components/ui/avatar"
import { AvatarFallback } from "./components/ui/avatar"
import AvatarImg from "./assets/avatar0.png"
import CustomTooltip from "./components/custom/custom-tooltip"

export function Layout() {
  return (
    <div>
      <header className="global-pad flex h-16 w-full flex-row items-center justify-between bg-secondary text-primary">
        {/* left side of header  */}
        <div className="flex flex-row space-x-5">
          <span className="text-2xl font-black shadow-2xl">ARIS</span>
          {/* <div className="h-7 w-1 bg-primary"></div> */}
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
      <main></main>
    </div>
  )
}

export default Layout

