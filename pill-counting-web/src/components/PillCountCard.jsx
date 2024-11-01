import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AlertCard from "./AlertCard";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PillCountCard({
  pillCount,
  damagedPillCount,
  hasAlert,
  setIsSettingsDialogOpen,
}) {
  return (
    <Card className="flex items-center grow">
      <CardContent className="p-3 grow">
        <Button
          className="absolute right-6 top-6"
          onClick={() => setIsSettingsDialogOpen(true)}
          variant="outline"
          size="icon"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <div className="flex items-center justify-center mb-3">
          {/* <span className="text-lg font-medium">
            Pill Count
          </span> */}
          <span className={"text-6xl font-bold"}>
            {Math.max(pillCount + damagedPillCount, 0)}
          </span>
        </div>
        <AlertCard
          hasAlert={hasAlert}
          damagedPillCount={damagedPillCount}
        />
      </CardContent>
    </Card>
  );
}
