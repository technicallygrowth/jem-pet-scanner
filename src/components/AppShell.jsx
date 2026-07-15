import { useState } from 'react';
import BottomNav from './BottomNav';
import Methodology from './Methodology';
import ProfileCreation from './ProfileCreation';
import EditPetProfile from './EditPetProfile';
import HomeTab from './HomeTab';
import ScanTab from './ScanTab';
import CareTab from './CareTab';
import TipsTab from './TipsTab';
import './AppShell.css';

const TAB_COMPONENTS = { home: HomeTab, scan: ScanTab, care: CareTab, tips: TipsTab };

export default function AppShell({ activePet, petsState }) {
  const [activeTab, setActiveTab] = useState('home');
  // Full-screen overlays (methodology, add pet, edit pet) take over the
  // whole shell — including hiding the tab bar — then return to whichever
  // tab was active before, same pattern the single-view Dashboard used.
  const [overlay, setOverlay] = useState(null); // null | 'methodology' | 'addPet' | 'editPet'

  const { addPet, updatePet, removePet } = petsState;

  function handleAddPet(data) {
    addPet(data);
    setOverlay(null);
  }

  function handleSaveEdit(data) {
    updatePet(activePet.id, data);
    setOverlay(null);
  }

  function handleDeletePet() {
    removePet(activePet.id);
    setOverlay(null);
  }

  if (overlay === 'methodology') {
    return <Methodology onBack={() => setOverlay(null)} />;
  }

  if (overlay === 'addPet') {
    return <ProfileCreation onSave={handleAddPet} onCancel={() => setOverlay(null)} />;
  }

  if (overlay === 'editPet') {
    return (
      <EditPetProfile
        pet={activePet}
        onSave={handleSaveEdit}
        onCancel={() => setOverlay(null)}
        onDelete={handleDeletePet}
      />
    );
  }

  const ActiveTabComponent = TAB_COMPONENTS[activeTab] ?? HomeTab;

  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <ActiveTabComponent
          activePet={activePet}
          petsState={petsState}
          onNavigate={setActiveTab}
          onShowMethodology={() => setOverlay('methodology')}
          onShowAddPet={() => setOverlay('addPet')}
          onShowEditPet={() => setOverlay('editPet')}
        />
      </div>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
