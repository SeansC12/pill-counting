"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SettingsDialog({
  isSettingsDialogOpen,
  setIsSettingsDialogOpen,
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabs = [
    "Error logs",
    "Blob detection devmode",
    "Other settings",
  ];

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
            <div className="bg-gray-100 dark:bg-gray-800 h-[calc(100%-2rem)] rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Add your components here for the &quot;
                {tabs[activeTabIndex]}&quot; tab
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
