import { notFound } from "next/navigation"
import { getTeamById } from "@/lib/teams-data"
import { MatchDayPlanner } from "@/components/match-day-planner"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function PlannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = getTeamById(id)

  if (!team) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader backHref={`/team/${id}`} backLabel={`Volver a ${team.shortName}`} subtitle="Planificador" />

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <MatchDayPlanner team={team} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
