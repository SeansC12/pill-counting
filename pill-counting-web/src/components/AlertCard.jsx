import React, { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ErrorAlert = ({ message, hasAlert }) => (
  <div
    className={cn(
      "flex items-center justify-center text-destructive",
      hasAlert ? "text-destructive" : "text-green-700"
    )}
  >
    <span className="text-lg font-bold">{message}</span>
  </div>
);

export default function AlertCard({
  hasAlert,
  damagedPillCount,
}) {
  return (
    <div>
      <ErrorAlert
        message={`${damagedPillCount} suspected damage pill(s).`}
        hasAlert={hasAlert}
      />
    </div>
  );
}
