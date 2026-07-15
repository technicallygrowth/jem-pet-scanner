import { useTranslation } from 'react-i18next';
import LanguageToggle from './components/LanguageToggle';
import AppShell from './components/AppShell';
import ProfileCreation from './components/ProfileCreation';
import { usePets } from './hooks/usePets';
import './App.css';

function App() {
  const { t } = useTranslation();
  const petsState = usePets();
  const { pets, activePet, addPet } = petsState;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">{t('app.title')}</h1>
        <LanguageToggle />
      </header>

      <main className="app__main">
        {pets.length === 0 || !activePet ? (
          <ProfileCreation onSave={addPet} />
        ) : (
          <AppShell activePet={activePet} petsState={petsState} />
        )}
      </main>
    </div>
  );
}

export default App;
