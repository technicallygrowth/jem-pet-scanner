import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './components/LanguageToggle';
import AppLogo from './components/AppLogo';
import AppShell from './components/AppShell';
import ProfileCreation from './components/ProfileCreation';
import { usePets } from './hooks/usePets';
import './App.css';

function App() {
  const { t } = useTranslation();
  const petsState = usePets();
  const { pets, activePet, addPet } = petsState;
  // Owned here (not inside AppShell) so the header logo can jump back to
  // Home and dismiss any open overlay from a single click, regardless of
  // which tab or full-screen view is currently showing.
  const [activeTab, setActiveTab] = useState('home');
  const [overlay, setOverlay] = useState(null); // null | 'methodology' | 'addPet' | 'editPet'

  function goHome() {
    setActiveTab('home');
    setOverlay(null);
  }

  return (
    <div className="app">
      <header className="app__header">
        <button type="button" className="app__brand" onClick={goHome} aria-label={t('nav.home')}>
          <AppLogo size={30} />
          <h1 className="app__title">{t('app.title')}</h1>
        </button>
        <LanguageToggle />
      </header>

      <main className="app__main">
        {pets.length === 0 || !activePet ? (
          <ProfileCreation onSave={addPet} />
        ) : (
          <AppShell
            activePet={activePet}
            petsState={petsState}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            overlay={overlay}
            setOverlay={setOverlay}
          />
        )}
      </main>
    </div>
  );
}

export default App;
