"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchTeams } from "@/lib/teams-data"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export function TeamSearch() {
  const [query, setQuery] = useState("")
  const results = useMemo(() => searchTeams(query), [query])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por equipo o ciudad..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-6 text-lg"
        />
      </div>

      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((team) => (
                <Link key={team.id} href={`/team/${team.id}`}>
                  <Card className="mb-2 p-4 hover:bg-accent/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <Image
                        src={team.badge || "/placeholder.svg"}
                        alt={team.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                      <div>
                        <h4 className="font-semibold">{team.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {team.city}, {team.region}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">No se encontraron resultados</div>
          )}
        </div>
      )}
    </div>
  )
}
