import { useState, useEffect, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import useOSMDLoader from "./useOSMDLoader.tsx";
import useCursor from "./useCursor.tsx";
import useScoreHighlighter from "./useScoreHighlighter.tsx";
import useScoreData from "./useScoreData.tsx";

const useOSMD = (elementRef, url) => {
  const [osmd, setOsmd] = useState(null);
  const osmdRef = useRef(null);
  const { highlightGreen } = useScoreHighlighter(osmd);
  const { getData, systemHeight } = useScoreData(osmd);

  const cursor = useCursor(
    osmd,
    elementRef.current, // Pass elementRef.current instead of containerRef.current
    systemHeight //this should be change to receive the whole scoreData interface that doesn't yet exist.
  );
  const { loadMusicXML } = useOSMDLoader(osmd, {
    onReady: () => {
      getData();
      cursor.initializeCursor();
    },
  });

  useEffect(() => {
    if (!osmdRef.current && elementRef.current && url) {
      osmdRef.current = new OpenSheetMusicDisplay(elementRef.current, {
        autoResize: true,
        backend: "svg",
        //drawingParameters: "compacttight",
        drawTitle: true,
        cursorsOptions: [
          {
            type: 0,
            color: "#FF0000",
            alpha: 80,
            follow: true,
          },
        ],
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false,
        drawCredits: false,
        drawPartNames: false,
        //drawMeasureNumbers: true,
        drawFingerings: true,
        renderSingleHorizontalStaffline: false,
      });
      setOsmd(osmdRef.current);
      loadMusicXML(url);
    }
  }, [elementRef, url]);

  return { osmd, ...cursor };
};

export default useOSMD;
