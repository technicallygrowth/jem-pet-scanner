import { useTranslation } from 'react-i18next';
import LanguageToggle from './components/LanguageToggle';
import Dashboard from './components/Dashboard';
import ProfileCreation from './components/ProfileCreation';
import { usePet } from './hooks/usePet';
import './App.css';

function App() {
  const { t } = useTranslation();
  const { pet, savePet, clearPet } = usePet();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">{t('app.title')}</h1>
        <LanguageToggle />
      </header>

      <main className="app__main">
        {!pet ? (
          <ProfileCreation onSave={savePet} />
        ) : (
          <Dashboard pet={pet} onEditPet={clearPet} />
        )}
      </main>
    </div>
  );
}

export default App;
