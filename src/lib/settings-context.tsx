"use client";
import { createContext, useContext } from "react";
import type { StoreSettings } from "@/types";
const SettingsContext = createContext<StoreSettings | null>(null);
export function SettingsProvider({ settings, children }: { settings: StoreSettings; children: React.ReactNode }) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}
export function useStoreSettings(): StoreSettings {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error("Missing store settings provider");
  return settings;
}
