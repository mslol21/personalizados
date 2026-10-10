"use client";

import React from "react";
import Link from "next/link";
import { CampaignBanner as CampaignType } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";

interface CampaignBannerProps {
  campaigns: CampaignType[];
}

export function CampaignBannerSection({ campaigns }: CampaignBannerProps) {
  const activeCampaigns = campaigns.filter((c) => c.isActive);

  if (activeCampaigns.length === 0) return null;

  const campaign = activeCampaigns[0];

  return (
    <section className="py-6 bg-brand-gold-50/50 border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-gold-700 via-brand-gold-600 to-amber-700 p-6 sm:p-8 text-white shadow-card">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              {campaign.badge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-brand-gold-100 border border-white/20">
                  <Sparkles className="w-3 h-3" />
                  {campaign.badge}
                </span>
              )}
              <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight">
                {campaign.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-gold-100 max-w-2xl leading-relaxed">
                {campaign.subtitle}
              </p>
            </div>

            <Link
              href={campaign.buttonLink || "/catalogo"}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-brand-graphite-900 bg-white hover:bg-brand-gold-50 transition-all text-xs sm:text-sm shrink-0 shadow-subtle"
            >
              <span>{campaign.buttonText || "Conferir Ofertas"}</span>
              <ArrowRight className="w-4 h-4 text-brand-gold-700" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
