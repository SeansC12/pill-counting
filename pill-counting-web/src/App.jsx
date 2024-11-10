import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
// import useInference from "./hooks/useInference";
import { cn } from "./lib/utils";

import {
  drawBoxes,
  adjustCanvas,
  handleDamagedPillState,
} from "./lib/utils";

import PillCountCard from "./components/PillCountCard";
import SettingsCard from "./components/SettingsCard";
import { Skeleton } from "./components/ui/skeleton";
import SettingsDialog from "./components/SettingsDialog";

const WEBCAM_VIDEO_HEIGHT = 568;
const WEBCAM_VIDEO_WIDTH = 700;

function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();

  const [pillCount, setPillCount] = useState(0);
  const [damagedPillCount, setDamagedPillCount] =
    useState(0);

  const [isAreaEnabled, setIsAreaEnabled] = useState(true);
  const [isColourEnabled, setIsColourEnabled] =
    useState(true);
  const [isBlobEnabled, setIsBlobEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] =
    useState(0.5);
  const [iouThreshold, setIouThreshold] = useState(0.5);

  const [hasAlert, setHasAlert] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] =
    useState(false);

  const [isModelInitialising, setIsModelInitialising] =
    useState(true);

  const isAreaEnabledRef = useRef(isAreaEnabled);
  const isColourEnabledRef = useRef(isColourEnabled);
  const isBlobEnabledRef = useRef(isBlobEnabled);
  const confidenceThresholdRef = useRef(
    confidenceThreshold
  );
  const iouThresholdRef = useRef(iouThreshold);

  useEffect(() => {
    isAreaEnabledRef.current = isAreaEnabled;
  }, [isAreaEnabled]);

  useEffect(() => {
    isColourEnabledRef.current = isColourEnabled;
  }, [isColourEnabled]);

  useEffect(() => {
    isBlobEnabledRef.current = isBlobEnabled;
  }, [isBlobEnabled]);

  useEffect(() => {
    confidenceThresholdRef.current = confidenceThreshold;
  }, [confidenceThreshold]);

  useEffect(() => {
    iouThresholdRef.current = iouThreshold;
  }, [iouThreshold]);

  useEffect(() => {
    const fetchInterval = setInterval(async () => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const imageToSend =
          webcamRef.current.getScreenshot();

        const res = await fetch(
          "http://192.168.2.30:5001",
          {
            method: "POST",
            headers: {
              Accept: "text/plain",
              "Content-Type": "text/plain",
            },
            body: JSON.stringify({
              image: imageToSend,
              is_area_enabled: isAreaEnabledRef.current,
              is_colour_enabled: isColourEnabledRef.current,
              is_blob_enabled: isBlobEnabledRef.current,
              confidence_threshold:
                confidenceThresholdRef.current,
              iou_threshold: iouThresholdRef.current,
            }),
          }
        );

        if (res.status !== 200) {
          setIsModelInitialising(true);
          console.error(res.statusText);
          return;
        }

        setIsModelInitialising(false);

        const detections = await res.json();

        console.log(detections);

        setPillCount(
          detections
            ? detections.filter((d) => !d.is_damaged).length
            : 0
        );

        handleDamagedPillState(
          setDamagedPillCount,
          detections,
          setHasAlert
        );

        if (!detections) return;

        const normalColour = "#00FF00";
        const brokenColour = "#FF0000";

        adjustCanvas(webcamRef, canvasRef);

        drawBoxes(
          canvasRef,
          detections,
          normalColour,
          brokenColour
        );
      }
    }, 1500);
    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  return (
    <div className="p-4 flex h-[600px] gap-4">
      <SettingsDialog
        isSettingsDialogOpen={isSettingsDialogOpen}
        setIsSettingsDialogOpen={setIsSettingsDialogOpen}
      />
      <div
        className={cn(
          // "w-[" + WEBCAM_VIDEO_WIDTH + "px]",
          "w-[700px]",
          "aspect-square"
        )}
      >
        <div
          className={cn(
            "relative",
            "h-[" + WEBCAM_VIDEO_HEIGHT + "px]",
            "w-[" + WEBCAM_VIDEO_WIDTH + "px]"
          )}
        >
          <Webcam
            ref={webcamRef}
            muted={true}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: WEBCAM_VIDEO_WIDTH,
              height: WEBCAM_VIDEO_HEIGHT,
              facingMode: "user",
            }}
            className="absolute left-0 right-0 text-center z-10 rounded-xl"
          />
          <canvas
            ref={canvasRef}
            className="absolute left-0 right-0 text-center z-20"
          />
          {isModelInitialising && (
            <div className="absolute z-30 w-full h-full text-center left-1/2 -translate-x-1/2 top-[280px] text-white">
              Model is initialising. This can take up to 5
              minutes.
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col grow gap-4">
        <PillCountCard
          pillCount={pillCount}
          damagedPillCount={damagedPillCount}
          hasAlert={hasAlert}
          setIsSettingsDialogOpen={setIsSettingsDialogOpen}
        />
        <SettingsCard
          isAreaEnabled={isAreaEnabled}
          setIsAreaEnabled={setIsAreaEnabled}
          isColourEnabled={isColourEnabled}
          setIsColourEnabled={setIsColourEnabled}
          isBlobEnabled={isBlobEnabled}
          setIsBlobEnabled={setIsBlobEnabled}
          confidenceThreshold={confidenceThreshold}
          setConfidenceThreshold={setConfidenceThreshold}
          iouThreshold={iouThreshold}
          setIouThreshold={setIouThreshold}
        />
      </div>
    </div>
  );
}

export default App;
