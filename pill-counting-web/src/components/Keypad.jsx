"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

export default function PillCountChangeKeypad({
  totalPillCount,
  setTotalPillCount,
}) {
  const handleKeyPress = (digit) => {
    setTotalPillCount((curr) => curr + digit);
  };

  const handleErase = () => {
    setTotalPillCount((curr) => curr.slice(0, -1));
  };

  return (
    <Card className="w-full max-w-md mx-auto p-3 h-max">
      {/* <div className="mb-4 p-2 bg-gray-100 rounded-md">
        <p
          className="text-2xl text-right h-8"
          aria-live="polite"
        >
          {totalPillCount || "0"}
        </p>
      </div> */}
      <div className="grid grid-cols-3 gap-2">
        {[
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "0",
        ].map((digit, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleKeyPress(digit)}
            className="text-lg font-semibold h-12"
          >
            {digit}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={handleErase}
          className="text-lg font-semibold h-12 col-span-2"
          aria-label="Erase"
        >
          <Delete className="h-6 w-6" />
        </Button>
      </div>
    </Card>
  );
}
