"use client";

import React from "react";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Dashboard onLogout={() => { }} />
    </div>
  );
}
