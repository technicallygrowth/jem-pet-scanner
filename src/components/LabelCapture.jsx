import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LabelCapture.css';

// Uses <input type=file capture=environment> instead of getUserMedia +
// canvas: on iOS and Android that opens the native camera UI (with focus,
// flash, etc.), which is a better experience than a re-implemented one
// and works consistently across browsers.
export default function LabelCapture({ barcode, onCancel, onSubmitted }) {
  const { t } = useTranslation();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [note, setNote] = useState('');
  const fileInputRef = useRef(null);

  function openCamera() {
    fileInputRef.current?.click();
  }

  function handleFileChosen(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
  }

  function submit() {
    // Demo mode: nothing leaves the device (see docs/rubrica-v1-y-datos.md
    // section 4). The thank-you screen is explicit about that so we're not
    // promising the user we've received anything we haven't.
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    onSubmitted();
  }

  return (
    <div className="label-capture">
      <h2 className="label-capture__title">{t('capture.title')}</h2>
      <p className="label-capture__body">{t('capture.body')}</p>
      <p className="label-capture__barcode">{barcode}</p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChosen}
        hidden
      />

      {!photoUrl && (
        <button type="button" className="scanner__primary-button" onClick={openCamera}>
          {t('capture.takePhotoButton')}
        </button>
      )}

      {photoUrl && (
        <>
          <img src={photoUrl} alt="" className="label-capture__preview" />
          <button type="button" className="scanner__secondary-button" onClick={openCamera}>
            {t('capture.retakeButton')}
          </button>

          <label className="label-capture__note-label">
            {t('capture.noteLabel')}
            <textarea
              className="label-capture__note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={t('capture.notePlaceholder')}
            />
          </label>

          <button type="button" className="scanner__primary-button" onClick={submit}>
            {t('capture.submitButton')}
          </button>
        </>
      )}

      <button type="button" className="label-capture__cancel" onClick={onCancel}>
        {t('capture.cancelButton')}
      </button>
    </div>
  );
}
