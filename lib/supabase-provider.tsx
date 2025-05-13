"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { useToast } from "@/components/ui/use-toast"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const { toast } = useToast()
  const hasShownSignInToast = useRef(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !hasShownSignInToast.current) {
        toast({
          title: "Signed in successfully",
          description: "Welcome to Zenith!",
        })
        hasShownSignInToast.current = true
      }
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account.",
        })
        hasShownSignInToast.current = false
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, toast])

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
