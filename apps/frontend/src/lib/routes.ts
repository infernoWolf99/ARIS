import ANCVisits from "@/tabs/anc-visits"
import ChildProfile from "@/tabs/child-profile"
import COCTracker from "@/tabs/coc-tracker"
import Dashboard from "@/tabs/dashboard"
import DeliveryRecords from "@/tabs/delivery-records"
import FacilitySetup from "@/tabs/facility-setup"
import ObstetricHistory from "@/tabs/obstetric-history"
import PNCMother from "@/tabs/pnc-mother"
import Registration from "@/tabs/registration"
import type { RouteItemType } from "@/types/route.types"
import {
  BabyIcon,
  BicepsFlexed,
  ChartArea,
  LayoutDashboard,
  ListCheck,
  ScrollText,
  Settings, UserPlus2,
  Venus
} from "lucide-react"

const ClientRoutes: RouteItemType[] = [
  {
    title: "Dashboard",
    path: "dashboard",
    icon: LayoutDashboard,
    element: Dashboard,
    index: true,
  },
  {
    title: "Registration",
    path: "registration",
    icon: UserPlus2,
    element: Registration,
    index: false,
  },
  {
    title: "Facility Setup",
    path: "facility-setup",
    icon: Settings,
    element: FacilitySetup,
    index: false,
  },
  {
    title: "Obstetric History",
    path: "obstetric-history",
    icon: ScrollText,
    element: ObstetricHistory,
    index: false,
  },
  {
    title: "ANC Visits",
    path: "anc-visits",
    icon: ListCheck,
    element: ANCVisits,
    index: false,
  },
  {
    title: "Delivery Records",
    path: "delivery-records",
    icon: BabyIcon,
    element: DeliveryRecords,
    index: false,
  },
  {
    title: "PNC Mother",
    path: "pnc-mother",
    icon: Venus,
    element: PNCMother,
    index: false,
  },
  {
    title: "Child Profile",
    path: "child-profile",
    icon: BicepsFlexed,
    element: ChildProfile,
    index: false,
  },
  {
    title: "COC Tracker",
    path: "coc-tracker",
    icon: ChartArea,
    element: COCTracker,
    index: false,
  },
]

export default ClientRoutes
