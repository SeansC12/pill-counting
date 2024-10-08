import { useEffect, useState } from "react";

function useInference(webcamRef) {
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    setInterval(async () => {
      if (webcamRef !== null) {
        const imageToSend =
          webcamRef.current.getScreenshot();

        const res = await fetch("http://127.0.0.1:5000", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageToSend,
          }),
        });

        const data = await res.json();

        setPredictions(data);
      }
    }, 1000);
  }, []);

  return predictions;
}

export default useInference;
export const foo = 12;
