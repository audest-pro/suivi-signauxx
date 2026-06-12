import { RegistrationForm } from "@/components/registration-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Inscription</h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Remplissez le formulaire ci-dessous pour vous enregistrer. Nous vous recontacterons rapidement.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vos informations</CardTitle>
            <CardDescription>Tous les champs sont obligatoires.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Vous êtes administrateur ?{" "}
          <a href="/admin" className="font-medium text-foreground underline underline-offset-4">
            Accès admin
          </a>
        </p>
      </div>
    </main>
  )
}
