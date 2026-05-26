"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Search, MapPin, Home, Users, X, Loader2, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchTeams, type Team } from "@/lib/teams-data"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useI18nStore } from "@/lib/stores"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TeamSearchProps {
  variant?: "default" | "hero"
  onSelect?: (team: Team) => void
  autoFocus?: boolean
}

export function TeamSearch({ variant = "default", onSelect, autoFocus = false }: TeamSearchProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const { locale } = useI18nStore()

  // Debounce search query
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setIsSearching(false)
    }, 150)
    return () => clearTimeout(timer)
  }, [query])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [debouncedQuery])

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return []
    return searchTeams(debouncedQuery)
  }, [debouncedQuery])

  const placeholder = locale === "es" ? "Buscar equipo, ciudad o estadio..." : "Search team, city or stadium..."
  const noResults = locale === "es" ? "No se encontraron resultados para" : "No results found for"
  const searchHint = locale === "es" ? "Escribe para buscar equipos" : "Type to search teams"
  const resultsCount = locale === "es" 
    ? `${results.length} equipo${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`
    : `${results.length} team${results.length !== 1 ? 's' : ''} found`

  const handleClear = useCallback(() => {
    setQuery("")
    setDebouncedQuery("")
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!results.length) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          const team = results[selectedIndex]
          if (onSelect) {
            onSelect(team)
          } else {
            window.location.href = `/team/${team.id}`
          }
        }
        break
      case "Escape":
        e.preventDefault()
        setIsFocused(false)
        inputRef.current?.blur()
        break
    }
  }, [results, selectedIndex, onSelect])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  const showResults = isFocused && (query.length > 0 || debouncedQuery.length > 0)

  const isHero = variant === "hero"

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none ${isSearching ? 'opacity-0' : 'opacity-100'} transition-opacity`} />
        {isSearching && (
          <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
        )}
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          className={`w-full pl-12 ${query ? 'pr-10' : 'pr-4'} ${isHero ? 'py-6 text-lg' : 'py-2 text-base'} transition-all`}
          autoComplete="off"
          autoFocus={autoFocus}
          aria-label={locale === "es" ? "Buscar equipos" : "Search teams"}
          aria-expanded={showResults}
          aria-controls="search-results"
          role="combobox"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted"
            onClick={handleClear}
            aria-label={locale === "es" ? "Limpiar busqueda" : "Clear search"}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <div 
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
          role="listbox"
        >
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 border-b border-border bg-muted/30">
                <p className="text-xs text-muted-foreground font-medium">{resultsCount}</p>
              </div>
              <div ref={resultsRef} className="max-h-80 overflow-y-auto">
                {results.map((team, index) => (
                  <Link 
                    key={team.id} 
                    href={`/team/${team.id}`} 
                    className="block"
                    onClick={() => onSelect?.(team)}
                  >
                    <div 
                      className={`p-3 transition-colors cursor-pointer border-b border-border/50 last:border-b-0 ${
                        selectedIndex === index ? 'bg-accent/20' : 'hover:bg-accent/10'
                      }`}
                      role="option"
                      aria-selected={selectedIndex === index}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 relative bg-muted rounded-lg p-1">
                          <Image
                            src={team.badge || "/placeholder.svg"}
                            alt={team.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">{team.name}</h4>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {team.shortName}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {team.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {team.stadium.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {team.stadium.capacity.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-border bg-muted/30">
                <p className="text-[10px] text-muted-foreground">
                  {locale === "es" 
                    ? "Usa las flechas para navegar, Enter para seleccionar" 
                    : "Use arrows to navigate, Enter to select"}
                </p>
              </div>
            </>
          ) : debouncedQuery.trim() ? (
            <div className="p-8 text-center">
              <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium mb-1">
                {noResults} &quot;{debouncedQuery}&quot;
              </p>
              <p className="text-xs text-muted-foreground">
                {locale === "es" 
                  ? "Prueba con otro nombre, ciudad o estadio" 
                  : "Try another name, city or stadium"}
              </p>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">
              {searchHint}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
