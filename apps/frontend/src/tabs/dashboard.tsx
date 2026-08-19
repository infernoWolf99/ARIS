import React from "react"
// import { useApp } from "../../context/AppContext"

type RiskFactor = { id: number; name: string; detail: string }
type Patient = {
  id: number | string
  name: string
  age: number
  riskStatus: "High Risk" | "Normal" | string
  currentStage: string
  gestationWeeks: number
  edd: string
  gravida: number
  para: number
  abortions: number
  livingChildren: number
  riskFactors: RiskFactor[]
}

const mockPatients: Patient[] = [
  {
    id: 1,
    name: "Ama Mensah",
    age: 28,
    riskStatus: "High Risk",
    currentStage: "ANC",
    gestationWeeks: 32,
    edd: "2026-09-12",
    gravida: 2,
    para: 1,
    abortions: 0,
    livingChildren: 1,
    riskFactors: [
      { id: 1, name: "Hypertension", detail: "BP elevated at 150/95" },
    ],
  },
  {
    id: 2,
    name: "Efua Owusu",
    age: 23,
    riskStatus: "Normal",
    currentStage: "PNC",
    gestationWeeks: 0,
    edd: "",
    gravida: 1,
    para: 1,
    abortions: 0,
    livingChildren: 1,
    riskFactors: [],
  },
]

const Dashboard: React.FC = () => {
  // Replace with context when available:
  // const { patients, setActivePatient, setActiveView, setQuickActionOpen } = useApp()
  const patients = mockPatients

  const [riskFilter, setRiskFilter] = React.useState<
    "All" | "High Risk" | "Normal"
  >("High Risk")

  
  const filteredPatients = patients.filter((p) => {
    if (riskFilter === "High Risk") return p.riskStatus === "High Risk"
    if (riskFilter === "Normal") return p.riskStatus === "Normal"
    return true
  })

  const highRiskPatients = patients.filter((p) => p.riskStatus === "High Risk")
  const activeAncCount =
    patients.filter((p) => p.currentStage === "ANC").length + 478

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--ring)] p-6 text-[color:var(--primary-foreground)] shadow-xs sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="mb-3 inline-block rounded-full bg-[color:var(--secondary)]/20 px-3 py-1 text-xs font-semibold text-[color:var(--secondary)]">
            Ghana Health Service • ARIS Portal
          </span>
          <h1 className="mb-2 text-2xl font-black tracking-tight sm:text-3xl">
            Antenatal Clinical Overview
          </h1>
          <p className="text-sm leading-relaxed text-[color:var(--secondary)]/90">
            Real-time maternal care tracking, high-risk patient surveillance,
            and continuum of care monitoring for Accra Polyclinic.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView("registration")}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-[color:var(--primary)] shadow-xs transition-colors hover:bg-[color:var(--secondary)] sm:text-sm"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              Register New Mother
            </button>

            <button
              onClick={() => setQuickActionOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[color:var(--secondary)]/30 bg-[color:var(--primary)] px-4 py-2.5 text-xs font-semibold text-[color:var(--primary-foreground)] transition-colors hover:bg-[color:var(--ring)] sm:text-sm"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Quick Record Logging
            </button>

            <button
              onClick={() => setActiveView("anc")}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[color:var(--secondary)]/40 bg-[color:var(--secondary)]/30 px-4 py-2.5 text-xs font-bold text-[color:var(--secondary)] transition-all hover:bg-[color:var(--secondary)] hover:text-[color:var(--primary)] sm:text-sm"
            >
              <span className="material-symbols-outlined text-lg">mic</span>
              Khaya Voice Dictate (Dagbani)
            </button>
          </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border border-[color:var(--border)]/30 bg-white p-5 shadow-xs">
          <div>
            <p className="mb-1 text-xs font-medium tracking-wider text-[color:var(--muted-foreground)] uppercase">
              Active ANC Clients
            </p>
            <div className="text-2xl font-black text-[color:var(--foreground)]">
              {activeAncCount}
            </div>
            <p className="mt-1 flex items-center gap-0.5 text-xs font-semibold text-[color:var(--primary)]">
              <span className="material-symbols-outlined text-sm">
                trending_up
              </span>
              +12% this month
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[color:var(--border)]/30 bg-white p-5 shadow-xs">
          <div>
            <p className="mb-1 text-xs font-medium tracking-wider text-[#6e7978] uppercase">
              High Risk Watchlist
            </p>
            <div className="text-2xl font-black text-destructive">
              {highRiskPatients.length}
            </div>
            <p className="mt-1 text-xs font-semibold text-destructive">
              Requires active surveillance
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]">
            <span className="material-symbols-outlined icon-fill text-2xl">
              warning
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[color:var(--border)]/30 bg-white p-5 shadow-xs">
          <div>
            <p className="mb-1 text-xs font-medium tracking-wider text-[#6e7978] uppercase">
              Deliveries This Month
            </p>
            <div className="text-2xl font-black text-chart-4">42</div>
            <p className="mt-1 text-xs font-semibold text-chart-4">
              98% SVD • 2 C-Section
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--chart-4)/10 text-[color:var(--chart-4)]">
            <span className="material-symbols-outlined text-2xl">
              child_care
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-(--border)/30 bg-white p-5 shadow-xs">
          <div>
            <p className="mb-1 text-xs font-medium tracking-wider text-[#6e7978] uppercase">
              ANC 4+ Coverage
            </p>
            <div className="text-2xl font-black text-primary">88%</div>
            <p className="mt-1 text-xs font-semibold text-primary">
              Target: &gt;85% achieved
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-primary">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: High Risk Watchlist + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols): High Risk Watchlist */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined icon-fill text-2xl text-[color:var(--destructive)]">
                e911_emergency
              </span>
              <h2 className="text-lg font-bold text-[color:var(--foreground)]">
                Clinical Surveillance Watchlist
              </h2>
            </div>

            {/* Risk Filter Tabs */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[color:var(--border)]/40 bg-[color:var(--muted)] p-1">
              {(["High Risk", "Normal", "All"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRiskFilter(filter)}
                  className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                    riskFilter === filter
                      ? filter === "High Risk"
                        ? "bg-[color:var(--destructive)] text-[color:var(--primary-foreground)] shadow-xs"
                        : "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-xs"
                      : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col justify-between rounded-xl border border-[color:var(--border)]/40 bg-white p-4 shadow-xs transition-all hover:border-[color:var(--destructive)]"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[color:var(--foreground)]">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        ID: {patient.id} • Age: {patient.age}
                      </p>
                    </div>
                    <span className="rounded-full bg-[color:var(--destructive)]/10 px-2.5 py-0.5 text-[10px] font-bold text-[color:var(--destructive)]">
                      High Risk
                    </span>
                  </div>

                  <div className="my-2 space-y-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--muted)] p-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[color:var(--muted-foreground)]">Gestational Age:</span>
                      <span className="font-semibold text-[color:var(--foreground)]">
                        {patient.gestationWeeks} Weeks
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[color:var(--muted-foreground)]">EDD:</span>
                      <span className="font-semibold text-[color:var(--foreground)]">
                        {patient.edd}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[color:var(--muted-foreground)]">Obstetric Formula:</span>
                      <span className="font-semibold text-[color:var(--foreground)]">
                        G{patient.gravida} P{patient.para} A{patient.abortions}{" "}
                        L{patient.livingChildren}
                      </span>
                    </div>
                  </div>

                  {/* Primary Risk Factors */}
                  <div className="my-2 space-y-1">
                    {patient.riskFactors.map((rf) => (
                      <div
                        key={rf.id}
                        className="flex items-center gap-1.5 rounded-md bg-[color:var(--destructive)]/15 px-2 py-1 text-[11px] font-medium text-[color:var(--destructive)]"
                      >
                        <span className="material-symbols-outlined text-xs">
                          warning
                        </span>
                        <span className="truncate">
                          <strong>{rf.name}:</strong> {rf.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-[color:var(--border)] pt-3">
                  <span className="text-[11px] text-[color:var(--muted-foreground)]">
                    Stage:{" "}
                    <strong className="text-[color:var(--primary)]">
                      {patient.currentStage}
                    </strong>
                  </span>
                  <button
                    onClick={() => {
                      setActivePatient(patient)
                      setActiveView("anc")
                    }}
                    className="cursor-pointer rounded-lg bg-[color:var(--primary)] px-3 py-1.5 text-xs font-semibold text-[color:var(--primary-foreground)] transition-colors hover:bg-[color:var(--ring)]"
                  >
                    Open Clinical Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clinical Trend Metrics & Quick Shortcuts */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[color:var(--border)]/30 bg-white p-5 shadow-xs">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[color:var(--foreground)]">
              <span className="material-symbols-outlined text-[color:var(--primary)]">
                bar_chart
              </span>
              Monthly Registration Trends
            </h3>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-[#3e4948]">New ANC Registrations</span>
                  <span className="font-bold text-[#111c2d]">64 / mo</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--muted)]">
                  <div className="h-full w-[78%] bg-[color:var(--primary)]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-[#3e4948]">PNC 6-Week Completion</span>
                  <span className="font-bold text-[#111c2d]">82%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--muted)]">
                  <div className="h-full w-[82%] bg-[color:var(--chart-4)]" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-[#3e4948]">
                    Deworming & Malaria IPTp Coverage
                  </span>
                  <span className="font-bold text-[#111c2d]">91%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--muted)]">
                  <div className="h-full w-[91%] bg-[color:var(--ring)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--border)]/40 bg-[color:var(--muted)] p-5 shadow-xs">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[color:var(--foreground)]">
              <span className="material-symbols-outlined text-[color:var(--primary)]">
                menu_book
              </span>
              GHS ANC Standard Protocols
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-[#3e4948]">
              All ANC visits require mandatory BP, Hemoglobin, Urine Protein,
              and HIV re-testing protocols at designated trimesters.
            </p>
            <p className="mb-4 text-xs leading-relaxed text-[color:var(--muted-foreground)]">
              All ANC visits require mandatory BP, Hemoglobin, Urine Protein,
              and HIV re-testing protocols at designated trimesters.
            </p>
            <button
              onClick={() => setActiveView("coc")}
              className="w-full cursor-pointer rounded-lg border border-[color:var(--primary)] bg-white py-2 text-xs font-semibold text-[color:var(--primary)] transition-all hover:bg-[color:var(--primary)] hover:text-[color:var(--primary-foreground)]"
            >
              Review Continuum of Care Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
