import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export default function SettingsCard({
  isAreaEnabled,
  setIsAreaEnabled,
  isColourEnabled,
  setIsColourEnabled,
  isBlobEnabled,
  setIsBlobEnabled,
  confidenceThreshold,
  setConfidenceThreshold,
  iouThreshold,
  setIouThreshold,
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          Model Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="notifications"
              className="text-base font-medium"
            >
              Area Check
            </Label>
            <Switch
              id="notifications"
              checked={isAreaEnabled}
              onCheckedChange={setIsAreaEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="darkMode"
              className="text-base font-medium"
            >
              Colour Check
            </Label>
            <Switch
              id="darkMode"
              checked={isColourEnabled}
              onCheckedChange={setIsColourEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="autoSave"
              className="text-base font-medium"
            >
              Blob Detection
            </Label>
            <Switch
              id="autoSave"
              checked={isBlobEnabled}
              onCheckedChange={setIsBlobEnabled}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label
              htmlFor="volume"
              className="text-base font-medium"
            >
              Confidence Threshold
            </Label>
            <Slider
              id="volume"
              max={1}
              defaultValue={[0.5]}
              step={0.1}
              className="w-full"
              onValueChange={(value) =>
                setConfidenceThreshold(value)
              }
            />
            <p className="text-sm text-muted-foreground text-center">
              {confidenceThreshold}
            </p>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="brightness"
              className="text-base font-medium"
            >
              IOU Threshold
            </Label>
            <Slider
              id="brightness"
              max={1}
              defaultValue={[0.5]}
              step={0.1}
              className="w-full"
              onValueChange={(value) =>
                setIouThreshold(value)
              }
            />
            <p className="text-sm text-muted-foreground text-center">
              {iouThreshold}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
