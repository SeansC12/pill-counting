import React, { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ErrorAlert = ({ message }) => (
  <div className="flex items-center space-x-2 bg-destructive/15 text-destructive rounded-md p-3">
    <AlertCircle className="h-5 w-5" />
    <span className="text-lg font-medium">{message}</span>
  </div>
);

const SuccessAlert = ({ message }) => (
  <div className="flex items-center space-x-2 bg-green-200 text-green-800 rounded-md p-3">
    <CheckCircle2 className="h-5 w-5" />
    <span className="text-lg font-medium">{message}</span>
  </div>
);

export default function AlertCard({
  hasAlert,
  damagedPillCount,
}) {
  return (
    // <Card
    //   className={cn(
    //     "transition-colors duration-300 w-full",
    //     hasAlert ? "border-destructive" : "border-green-500"
    //   )}
    // >
    //   <CardContent className="pt-6">
    //     {hasAlert ? (
    //       <ErrorAlert
    //         message={`${damagedPillCount} damaged pills detected.`}
    //       />
    //     ) : (
    //       <SuccessAlert message="Everything looks good." />
    //     )}
    //   </CardContent>
    // </Card>
    <div>
      {hasAlert ? (
        <ErrorAlert
          message={`${damagedPillCount} damaged pills detected.`}
        />
      ) : (
        <SuccessAlert message={"Everything looks good."} />
      )}
    </div>
  );
}
