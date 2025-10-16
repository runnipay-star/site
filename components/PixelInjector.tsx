import React, { useEffect } from 'react';

interface PixelInjectorProps {
  htmlString: string;
  pixelId: string;
}

const InjectSinglePixel: React.FC<PixelInjectorProps> = ({ htmlString, pixelId }) => {
  useEffect(() => {
    if (!htmlString || !htmlString.trim()) {
      return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    const scripts = Array.from(tempDiv.querySelectorAll('script'));
    const createdScripts: HTMLScriptElement[] = [];

    scripts.forEach(parsedScript => {
      const newScript = document.createElement('script');
      
      // Copy attributes from the parsed script to the new one
      Array.from(parsedScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy inner content
      if (parsedScript.innerHTML) {
        newScript.innerHTML = parsedScript.innerHTML;
      }
      
      // Add our custom attribute for cleanup
      newScript.dataset.pixelId = pixelId;
      
      document.body.appendChild(newScript);
      createdScripts.push(newScript);
    });

    // Cleanup function to remove the scripts when the component unmounts or htmlString changes
    return () => {
      createdScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      // Also clean up any potential leftovers with the same ID
      document.querySelectorAll(`[data-pixel-id="${pixelId}"]`).forEach(el => el.remove());
    };
  }, [htmlString, pixelId]);

  return null; // This component does not render anything
};


interface PixelManagerProps {
    facebookPixelHtml?: string;
    tiktokPixelHtml?: string;
}

const PixelInjector: React.FC<PixelManagerProps> = ({ facebookPixelHtml, tiktokPixelHtml }) => {
    return (
        <>
            {facebookPixelHtml && <InjectSinglePixel htmlString={facebookPixelHtml} pixelId="fb-pixel" />}
            {tiktokPixelHtml && <InjectSinglePixel htmlString={tiktokPixelHtml} pixelId="tt-pixel" />}
        </>
    );
};

export default PixelInjector;
