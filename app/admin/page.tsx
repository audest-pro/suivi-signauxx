import { isAuthenticated, logout } from "@/app/actions/auth"
import { AdminLogin } from "@/components/admin-login"
import { CopyColumnButton } from "@/components/copy-column-button"
import { sql, type Submission } from "@/lib/db"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Users } from "lucide-react"

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

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord admin</h1>
          <p className="mt-1 text-muted-foreground">Toutes les inscriptions enregistrées.</p>
        </div>
        <form action={logout}>
          <Button variant="outline" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </form>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
            <Users className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl">{submissions.length}</CardTitle>
            <CardDescription>Inscription{submissions.length > 1 ? "s" : ""} au total</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          {submissions.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">Aucune inscription pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className="align-middle">Prénom</span>
                      <CopyColumnButton label="Prénoms" values={submissions.map((s) => s.first_name)} />
                    </TableHead>
                    <TableHead>
                      <span className="align-middle">Nom</span>
                      <CopyColumnButton label="Noms" values={submissions.map((s) => s.last_name)} />
                    </TableHead>
                    <TableHead>
                      <span className="align-middle">Email</span>
                      <CopyColumnButton label="Emails" values={submissions.map((s) => s.email)} />
                    </TableHead>
                    <TableHead>
                      <span className="align-middle">WhatsApp</span>
                      <CopyColumnButton label="Numéros WhatsApp" values={submissions.map((s) => s.whatsapp)} />
                    </TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.first_name}</TableCell>
                      <TableCell>{s.last_name}</TableCell>
                      <TableCell>
                        <a href={`mailto:${s.email}`} className="underline underline-offset-4">
                          {s.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-4"
                        >
                          {s.whatsapp}
                        </a>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(s.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
