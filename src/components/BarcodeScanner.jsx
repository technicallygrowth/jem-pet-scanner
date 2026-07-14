import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnalysisResult from './AnalysisResult';
import './BarcodeScanner.css';

// 1D product barcode formats we care about for pet food packaging.
// Native BarcodeDetector wants these lowercase strings (per the Shape
// Detection API spec).
const BARCODE_FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
const FALLBACK_CONTAINER_ID = 'html5-qrcode-region';
// Some desktop Chrome/Edge builds expose window.BarcodeDetector but its
// detect() call never actually succeeds (a known desktop gap — the API is
// mainly solid on Android). If it throws this many times in a row instead of
// just finding "no barcode this frame", we give up on native and switch to
// the html5-qrcode fallback automatically.
const NATIVE_ERROR_LIMIT = 20;

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

  const startFallbackScan = useCallback(async () => {
    setUsingFallback(true);
    const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');
    // html5-qrcode's formatsToSupport takes its own numeric enum, not plain
    // format-name strings — passing strings silently matches zero formats,
    // so it can start the camera but never actually decode anything.
    const instance = new Html5Qrcode(FALLBACK_CONTAINER_ID, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ],
      verbose: false,
    });
    html5QrcodeRef.current = instance;
    await instance.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        // A fixed pixel qrbox can mismatch the actual rendered viewfinder
        // size on iOS Safari (camera shows, but nothing ever decodes) —
        // sizing it relative to the viewfinder dimensions the library
        // hands back avoids that mismatch on every device.
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const edge = Math.min(viewfinderWidth, viewfinderHeight);
          return { width: Math.floor(edge * 0.75), height: Math.floor(edge * 0.4) };
        },
        // Without this, iOS Safari defaults to a very low-res feed
        // (480x640) — too few pixels across each barcode bar to ever
        // decode. Requesting a higher resolution explicitly fixes that.
        videoConstraints: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      },
      (decodedText) => handleDetected(decodedText),
      () => {
        // Per-frame "nothing found" callback — expected on most frames, ignore.
      },
    );
    setStatus('scanning');
  }, [handleDetected]);

  const runNativeDetectionLoop = useCallback(
    (detector) => {
      let consecutiveErrors = 0;
      const tick = async () => {
        if (!videoRef.current) return;
        try {
          const results = await detector.detect(videoRef.current);
          consecutiveErrors = 0;
          if (results.length > 0) {
            handleDetected(results[0].rawValue);
            return;
          }
        } catch {
          consecutiveErrors += 1;
          if (consecutiveErrors >= NATIVE_ERROR_LIMIT) {
            stopNativeScan();
            startFallbackScan().catch(() => {
              setStatus('error');
              setErrorKey('genericError');
            });
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [handleDetected, stopNativeScan, startFallbackScan],
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
          <p className="scanner__tip">{t('scanner.distanceHint')}</p>
          {usingFallback && <p className="scanner__badge">{t('scanner.usingFallback')}</p>}
          <button type="button" className="scanner__secondary-button" onClick={reset}>
            {t('scanner.stopButton')}
          </button>
        </>
      )}

      {status === 'detected' && <AnalysisResult barcode={barcode} onScanAgain={startScanning} />}

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
