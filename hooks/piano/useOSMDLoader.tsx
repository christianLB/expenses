// hooks/piano/useOSMDLoader.tsx
import { useEffect } from "react";

interface IOSMDLoaderOptions {
  onReady?: () => void;
}

const useOSMDLoader = (osmd, { onReady }: IOSMDLoaderOptions) => {
  const loadMusicXML = async (file) => {
    if (osmd && file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const musicXmlContent = event.target.result;
        await osmd.load(musicXmlContent);
        osmd.render();
        if (onReady) {
          onReady();
        }
      };
      reader.readAsText(file);
    }
  };

  // Load a sample MusicXML file on component mount
  useEffect(() => {
    const loadSampleMusicXML = async () => {
      const response = await fetch("/sample.xml");
      const musicXMLContent = await response.text();
      const musicXMLFile = new File([musicXMLContent], "sample.xml", {
        type: "application/xml",
      });
      loadMusicXML(musicXMLFile); // Call loadMusicXML directly, instead of using the useOSMDLoader hook
    };

    if (osmd) {
      loadSampleMusicXML();
    }
  }, [osmd]);

  return { loadMusicXML };
};

export default useOSMDLoader;
