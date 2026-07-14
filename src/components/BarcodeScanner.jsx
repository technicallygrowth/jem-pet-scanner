import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './BarcodeScanner.css';

// 1D product barcode formats we care about for pet food packaging.
const BARCODE_FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
const FALLBACK_CONTAINER_ID = 'html5-qrcode-region';

// Native detector is fast and needs no extra download, but only Chrome/Edge/
// Android WebView support it today — Safari (iOS) never will, so the
// html5-qrcode fallback below is not optional, it's how iOS users scan at all.
function getNativeDetector() {
  if (typeof window === 'undefined' || !('BarcodeDetector' in window)) return null;
  return new window.BarcodeDetector({ formats: BARCODE_FORMATS });
}

export default function BarcodeScanner() {
  const { t } = useTranslation();
  const [status, setStatus] = useState('idle'); // idle | requesting | scanning | detected | error
  const [errorKey, setErrorKey] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  const stopNativeScan = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const stopFallbackScan = useCallback(async () => {
    const instance = html5QrcodeRef.current;
    if (!instance) return;
    try {
      await instance.stop();
      instance.clear();
    } catch {
      // Already stopped — nothing to clean up.
    }
    html5QrcodeRef.current = null;
  }, []);

  const stopScanning = useCallback(() => {
    stopNativeScan();
    stopFallbackScan();
  }, [stopNativeScan, stopFallbackScan]);

  useEffect(() => stopScanning, [stopScanning]);

  const handleDetected = useCallback(
    (value) => {
      setBarcode(value);
      setStatus('detected');
      stopScanning();
    },
    [stopScanning],
  );

  const runNativeDetectionLoop = useCallback(
    (detector) => {
      const tick = async () => {
        if (!videoRef.current) return;
        try {
          const results = await detector.detect(videoRef.current);
          if (results.length > 0) {
            handleDetected(results[0].rawValue);
            return;
          }
        } catch {
          // A single failed frame isn't fatal — keep trying on the next tick.
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [handleDetected],
  );

  const startNativeScan = useCallback(
    async (detector) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('scanning');
      runNativeDetectionLoop(detector);
    },
    [runNativeDetectionLoop],
  );

  const startFallbackScan = useCallback(async () => {
    setUsingFallback(true);
    const { Html5Qrcode } = await import('html5-qrcode');
    const instance = new Html5Qrcode(FALLBACK_CONTAINER_ID, {
      formatsToSupport: BARCODE_FORMATS.map((f) => f.toUpperCase()),
      verbose: false,
    });
    html5QrcodeRef.current = instance;
    await instance.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 260, height: 140 } },
      (decodedText) => handleDetected(decodedText),
      () => {
        // Per-frame "nothing found" callback — expected on most frames, ignore.
      },
    );
    setStatus('scanning');
  }, [handleDetected]);

  const startScanning = useCallback(async () => {
    setErrorKey(null);
    setBarcode(null);
    setUsingFallback(false);

    if (!window.isSecureContext) {
      setStatus('error');
      setErrorKey('notSecure');
      return;
    }

    setStatus('requesting');
    try {
      const detector = getNativeDetector();
      if (detector) {
        await startNativeScan(detector);
      } else {
        await startFallbackScan();
      }
    } catch (err) {
      setStatus('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorKey('permissionDenied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorKey('noCamera');
      } else {
        setErrorKey('genericError');
      }
    }
  }, [startNativeScan, startFallbackScan]);

  const reset = useCallback(() => {
    stopScanning();
    setStatus('idle');
    setBarcode(null);
    setErrorKey(null);
  }, [stopScanning]);

  return (
    <div className="scanner">
      {status === 'idle' && (
        <button type="button" className="scanner__primary-button" onClick={startScanning}>
          {t('scanner.startButton')}
        </button>
      )}

      {status === 'requesting' && <p className="scanner__hint">{t('scanner.requestingCamera')}</p>}

      {(status === 'scanning' || status === 'requesting') && (
        <div className="scanner__viewport">
          {/* Native path renders into this video element. */}
          <video ref={videoRef} className="scanner__video" playsInline muted hidden={usingFallback} />
          {/* Fallback path (html5-qrcode) renders its own video into this div. */}
          <div id={FALLBACK_CONTAINER_ID} className="scanner__fallback-region" hidden={!usingFallback} />
        </div>
      )}

      {status === 'scanning' && (
        <>
          <p className="scanner__hint">{t('scanner.pointAtBarcode')}</p>
          {usingFallback && <p className="scanner__badge">{t('scanner.usingFallback')}</p>}
          <button type="button" className="scanner__secondary-button" onClick={reset}>
            {t('scanner.stopButton')}
          </button>
        </>
      )}

      {status === 'detected' && (
        <div className="scanner__result">
          <span className="scanner__result-label">{t('scanner.detectedLabel')}</span>
          <span className="scanner__result-value">{barcode}</span>
          <button type="button" className="scanner__primary-button" onClick={startScanning}>
            {t('scanner.scanAgainButton')}
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="scanner__error">
          <h2>{t(`scanner.${errorKey}Title`)}</h2>
          <p>{t(`scanner.${errorKey}Body`)}</p>
          <button type="button" className="scanner__primary-button" onClick={startScanning}>
            {t('scanner.scanAgainButton')}
          </button>
        </div>
      )}
    </div>
  );
}
