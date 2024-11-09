"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const Disclaimer = () => (
  <Alert className="border-2 border-yellow-500 text-yellow-800 bg-yellow-300/30">
    <AlertTitle className="text-lg">
      The KKH7 team is not liable for any miscount or error
      in patient prescriptions.
    </AlertTitle>
    <AlertDescription>
      Double-checking the program's output is necessary to
      ensure the pill count is accurate and that only
      healthy pills are dispensed.
    </AlertDescription>
  </Alert>
);

export default function SettingsDialog({
  isSettingsDialogOpen,
  setIsSettingsDialogOpen,
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabs = ["Disclaimer", "App logs"];
  const components = [<Disclaimer />, <div>App logs</div>];

  return (
    <Dialog
      open={isSettingsDialogOpen}
      onOpenChange={setIsSettingsDialogOpen}
    >
      <DialogContent className="max-w-[90vw] w-[90vw] h-[80vh] max-h-[80vh]">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-1/5 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2">
            <nav className="flex flex-col h-full space-y-2">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTabIndex(index)}
                  className={cn(
                    "px-4 py-2 text-left rounded-lg transition-colors duration-200",
                    "bg-gray-100 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-700",
                    activeTabIndex === index &&
                      "bg-gray-900 text-white hover:bg-gray-900/90 hover:bg-primary/90"
                  )}
                >
                  {tabs[index]}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content area */}
          <div className="w-4/5 p-6">
            <h2 className="text-2xl font-bold mb-4">
              {tabs[activeTabIndex]}
            </h2>
            {/* Empty space for your components */}
            <div className="dark:bg-gray-800 h-[calc(100%-2rem)] rounded-lg flex items-start justify-center">
              {components[activeTabIndex]}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
