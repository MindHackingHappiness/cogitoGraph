// src/hooks/useWebGLSupport.ts
import { useState, useEffect } from 'react';

export const useWebGLSupport = () => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        if (!gl) {
          setErrorMessage('WebGL is not supported in this browser');
          setIsSupported(false);
          return false;
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          console.log('WebGL Renderer:', renderer);
        }

        setIsSupported(true);
        return true;
      } catch (e) {
        setErrorMessage(`WebGL initialization failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
        setIsSupported(false);
        return false;
      }
    };

    checkWebGL();
  }, []);

  return { isSupported, errorMessage };
};
