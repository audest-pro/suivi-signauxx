import { RegistrationForm } from "@/components/registration-form"

export default function HomePage() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center bg-background px-4 py-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-balance text-4xl font-black italic uppercase tracking-tighter sm:text-6xl gradient-text leading-none">
            Suivi de Signaux
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-white/50 font-medium text-sm sm:text-base max-w-xs mx-auto">
            Rejoignez notre communauté exclusive de trading.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 border border-white/5 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
              Votre Inscription
            </h2>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Champs obligatoires
            </p>
          </div>
          <RegistrationForm />
        </div>

        {/* Admin access link removed as requested */}
      </div>
    </main>
  )
}
