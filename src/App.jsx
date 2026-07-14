import { useTranslation } from 'react-i18next';
import LanguageToggle from './components/LanguageToggle';
import BarcodeScanner from './components/BarcodeScanner';
import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">{t('app.title')}</h1>
        <LanguageToggle />
      </header>

      <main className="app__main">
        <p className="app__tagline">{t('app.tagline')}</p>
        <BarcodeScanner />
      </main>
    </div>
  );
}

export default App;
