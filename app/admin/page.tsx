import { isAuthenticated, logout } from "@/app/actions/auth"
import { AdminLogin } from "@/components/admin-login"
import { sql, type Submission, type Signal } from "@/lib/db"
import { SignalManager } from "@/components/admin-signals"
import { SubmissionsManager } from "@/components/admin-submissions"
import { LogOut, Users, Zap, LayoutDashboard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    return <AdminLogin />
  }

  const submissions = (await sql`
    SELECT id, first_name, last_name, email, whatsapp, created_at
    FROM submissions
    ORDER BY created_at DESC
  `) as Submission[]

  let signals: Signal[] = []
  try {
    signals = (await sql`
      SELECT id, pair, type, entry_price, tp_price, sl_price, status, message, created_at
      FROM signals
      ORDER BY created_at DESC
    `) as Signal[]
  } catch (e) {
    console.log("Signals table might not exist yet.")
  }

  return (
    <main className="min-h-svh bg-background relative overflow-hidden flex flex-col">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-purple-600/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <LayoutDashboard className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter gradient-text leading-tight">
                Admin
              </h1>
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Dashboard</p>
            </div>
          </div>
          
          <form action={logout}>
            <button 
              type="submit"
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/50 font-bold uppercase italic text-[9px] tracking-widest cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
              Sortir
            </button>
          </form>
        </header>

        <Tabs defaultValue="submissions" className="w-full flex-1 flex flex-col">
          <TabsList className="bg-white/5 border border-white/10 p-1 h-11 rounded-xl mb-6 w-full max-w-xs mx-auto grid grid-cols-2">
            <TabsTrigger 
              value="submissions" 
              className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:font-black uppercase italic tracking-tighter"
            >
              Inscrits
            </TabsTrigger>
            <TabsTrigger 
              value="signals" 
              className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:font-black uppercase italic tracking-tighter"
            >
              Signaux
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="flex-1">
            {/* Stats Summary */}
            <div className="glass-card mb-6 p-4 border border-white/5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                <Users className="text-purple-400 h-5 w-5" />
              </div>
              <div>
                <span className="text-2xl font-black italic text-white tracking-tighter leading-none">{submissions.length}</span>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-0.5">Total Inscrits</p>
              </div>
            </div>

            <SubmissionsManager submissions={submissions} />
          </TabsContent>

          <TabsContent value="signals" className="flex-1">
            <SignalManager signals={signals} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
