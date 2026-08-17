import { Bell, Settings } from "lucide-react"
import { Avatar } from "./components/ui/avatar"

export function Layout() {
  return (
    <div>
      <header className="flex h-12 w-full flex-row items-center justify-between bg-secondary text-primary">
        {/* left side of header  */}
        <div className="flex flex-row">
          <span>ARIS</span>
          <div className="h-[95%] w-2 bg-primary"></div>
        </div>
        {/* right side of header  */}
        <div className="flex flex-row place-items-center">
          <Bell />
          <Settings />
          <Avatar />
        </div>
      </header>

      <main></main>
    </div>
  )
}

export default Layout
