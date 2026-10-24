import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ExecutiveGreeting } from "@/components/dashboard/ExecutiveGreeting";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CapacityWidget } from "@/components/dashboard/CapacityWidget";
import { VaccinationWidget } from "@/components/dashboard/VaccinationWidget";
import { RecentConsultationsTable } from "@/components/dashboard/RecentConsultationsTable";
import { InventoryStatusWidget } from "@/components/dashboard/InventoryStatusWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export const Dashboard: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased selection:bg-primary selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (offset by 64 (16rem) on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Scrollable Main Canvas */}
        <main className="w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex-1 relative">
          <div className="flex flex-col w-full max-w-7xl mx-auto">
            {/* Atmospheric Canvas Layer with Diffused Accent Orbs */}
            <div className="relative w-full">
              {/* Ambient Luminous Gradient Mesh */}
              <div
                aria-hidden="true"
                className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none -z-10"
              />
              <div
                aria-hidden="true"
                className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] rounded-full bg-surface-ice/40 blur-3xl pointer-events-none -z-10"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none -z-10"
              />

              {/* Executive Greeting & Action Toolbar */}
              <ExecutiveGreeting />

              {/* 4 High-Precision KPI Metric Cards */}
              <KpiCards />

              {/* Main Analytics Section: Revenue & Volume Trends */}
              <RevenueChart />

              {/* Secondary Split Widgets: Capacity vs Preventive Adherence */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <CapacityWidget />
                <VaccinationWidget />
              </section>

              {/* Lower Section: Recent Patients Table & Inventory Pharmacy Status */}
              <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
                <div className="xl:col-span-7">
                  <RecentConsultationsTable />
                </div>
                <div className="xl:col-span-5">
                  <InventoryStatusWidget />
                </div>
              </section>

              {/* Quick Actions Strip & Executive Activity Stream */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <QuickActions />
                </div>
                <div className="lg:col-span-7">
                  <ActivityFeed />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
