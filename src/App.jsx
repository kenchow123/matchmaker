import { useState, useEffect } from 'react';
import PublicPage from './components/PublicPage';
import AdminPage from './components/AdminPage';
import PinGate from './components/PinGate';
import Toast from './components/Toast';
import { useProfiles, useSubmissions } from './hooks/useSupabase';
import { useToast } from './hooks/useToast';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const isAdmin = hash === '#admin';
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [toast, showToast] = useToast();

  const {
    profiles,
    loading: profilesLoading,
    addProfile,
    updateProfile,
    deleteProfile,
  } = useProfiles();

  const {
    subs,
    loading: subsLoading,
    addSubmission,
    toggleRead,
    markAllRead,
    deleteSubmission,
    deleteByProfile,
  } = useSubmissions();

  const handlePublicSubmit = async (data) => {
    const result = await addSubmission(data);
    if (!result.error) {
      showToast('提交成功 💌 管理員會幫你轉發！');
    }
    return result;
  };

  return (
    <>
      <Toast message={toast} />

      {!isAdmin && (
        <PublicPage
          profiles={profiles}
          loading={profilesLoading}
          onSubmit={handlePublicSubmit}
          onToast={showToast}
        />
      )}

      {isAdmin && !adminUnlocked && (
        <PinGate
          onUnlock={() => setAdminUnlocked(true)}
          onError={showToast}
        />
      )}

      {isAdmin && adminUnlocked && (
        <AdminPage
          profiles={profiles}
          subs={subs}
          loading={profilesLoading || subsLoading}
          onAddProfile={addProfile}
          onUpdateProfile={updateProfile}
          onDeleteProfile={deleteProfile}
          onToggleRead={toggleRead}
          onMarkAllRead={markAllRead}
          onDeleteSub={deleteSubmission}
          onDeleteSubsByProfile={deleteByProfile}
          onToast={showToast}
        />
      )}
    </>
  );
}
