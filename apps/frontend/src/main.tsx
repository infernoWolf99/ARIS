import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import Layout from "./layout.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { BrowserRouter, Route, Routes } from "react-router"
import type { RouteItemType } from "./types/route.types.ts"
import ClientRoutes from "./lib/routes.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      {/* <TooltipProvider> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {ClientRoutes.map((item: RouteItemType) => {
                const Page = item.element

                return item.index ? (
                  <Route
                    key={item.title}
                    index
                    path={item.path}
                    element={<Page />}
                  />
                ) : (
                  <Route key={item.title} path={item.path} element={<Page />} />
                )
              })}
            </Route>
          </Routes>
        </BrowserRouter>
      {/* </TooltipProvider> */}
    </ThemeProvider>
  </StrictMode>
)
