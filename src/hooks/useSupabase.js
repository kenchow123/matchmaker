import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

/**
 * Hook to manage profiles (CRUD via Supabase).
 */
export function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setProfiles(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const addProfile = async (label) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ label, active: true })
      .select()
      .single();
    if (!error && data) setProfiles((prev) => [...prev, data]);
    return { data, error };
  };

  const updateProfile = async (id, updates) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    if (!error) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      );
    }
    return { error };
  };

  const deleteProfile = async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }
    return { error };
  };

  return { profiles, loading, addProfile, updateProfile, deleteProfile, refetch: fetchProfiles };
}

/**
 * Hook to manage submissions (CRUD via Supabase).
 */
export function useSubmissions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = useCallback(async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setSubs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const addSubmission = async (submission) => {
    const { data, error } = await supabase
      .from('submissions')
      .insert(submission)
      .select()
      .single();
    if (!error && data) setSubs((prev) => [data, ...prev]);
    return { data, error };
  };

  const toggleRead = async (id) => {
    const sub = subs.find((s) => s.id === id);
    if (!sub) return;
    const { error } = await supabase
      .from('submissions')
      .update({ is_read: !sub.is_read })
      .eq('id', id);
    if (!error) {
      setSubs((prev) =>
        prev.map((s) => (s.id === id ? { ...s, read: !s.is_read } : s)),
      );
    }
  };

  const markAllRead = async (profileId) => {
    const { error } = await supabase
      .from('submissions')
      .update({ is_read: true })
      .eq('target', profileId);
    if (!error) {
      setSubs((prev) =>
        prev.map((s) => (s.target === profileId ? { ...s, read: true } : s)),
      );
    }
  };

  const deleteSubmission = async (id) => {
    const { error } = await supabase.from('submissions').delete().eq('id', id);
    if (!error) {
      setSubs((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const deleteByProfile = async (profileId) => {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('target', profileId);
    if (!error) {
      setSubs((prev) => prev.filter((s) => s.target !== profileId));
    }
  };

  return {
    subs,
    loading,
    addSubmission,
    toggleRead,
    markAllRead,
    deleteSubmission,
    deleteByProfile,
    refetch: fetchSubs,
  };
}
