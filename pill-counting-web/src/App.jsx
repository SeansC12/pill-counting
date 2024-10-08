import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
// import useInference from "./hooks/useInference";
import { cn } from "./lib/utils";

import {
  drawBoxes,
  adjustCanvas,
  handleDamagedPillState,
} from "./lib/utils";

import PillProgressCard from "./components/PillProgressCard";
import AlertCard from "./components/AlertCard";
import PillCountChangeKeypad from "./components/Keypad";
import SettingsDialog from "./components/SettingsDialog";

const WEBCAM_VIDEO_HEIGHT = 568;
const WEBCAM_VIDEO_WIDTH = 568;

function App() {
  const webcamRef = useRef();
  const canvasRef = useRef();

  const [pillCount, setPillCount] = useState(0);
  const [damagedPillCount, setDamagedPillCount] =
    useState(0);
  const [totalPillCount, setTotalPillCount] =
    useState("40");

  const [hasAlert, setHasAlert] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] =
    useState(false);

  useEffect(() => {
    const fetchInterval = setInterval(async () => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const imageToSend =
          webcamRef.current.getScreenshot();

        const res = await fetch("http://localhost:5001", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageToSend,
          }),
        });

        if (res.status !== 200) {
          console.error(res.statusText);
          return;
        }

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
    }, 1000);
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
          "w-[" + WEBCAM_VIDEO_WIDTH + "px]",
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
            }}
            className="absolute left-0 right-0 text-center z-10 rounded-xl"
          />
          <canvas
            ref={canvasRef}
            className="absolute left-0 right-0 text-center z-20"
          />
        </div>
      </div>
      <div className="flex flex-col grow gap-4">
        <PillProgressCard
          pillCount={pillCount}
          totalPillCount={totalPillCount}
          setIsSettingsDialogOpen={setIsSettingsDialogOpen}
        />
        <PillCountChangeKeypad
          totalPillCount={totalPillCount}
          setTotalPillCount={setTotalPillCount}
        />
        <AlertCard
          hasAlert={hasAlert}
          damagedPillCount={damagedPillCount}
        />
      </div>
    </div>
  );
}

export default App;
