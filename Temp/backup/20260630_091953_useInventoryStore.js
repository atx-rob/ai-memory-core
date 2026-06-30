import { create } from 'zustand';
import { supabase } from '../supabase';

const useInventoryStore = create((set) => ({
  guns: [],
  isLoading: false,

  fetchGuns: async (userId) => {
    if (!userId) return;
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('guns')
        .select('*')
        .eq('userId', userId);
      
      if (error) throw error;
      set({ guns: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching guns:', error);
      set({ isLoading: false });
    }
  },

  addGun: async (gunData, userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('guns')
        .insert([{ ...gunData, userId }])
        .select();
      
      if (error) throw error;
      set((state) => ({ guns: [...state.guns, data[0]] }));
    } catch (error) {
      console.error('Error adding gun:', error);
      throw error; // Re-throw so component knows it failed
    }
  },

  updateGun: async (id, gunData) => {
    try {
      const { data, error } = await supabase
        .from('guns')
        .update(gunData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      set((state) => ({
        guns: state.guns.map((gun) => gun.id === id ? data[0] : gun)
      }));
      return data[0];
    } catch (error) {
      console.error('Error updating gun:', error);
      throw error;
    }
  },

  deleteGun: async (id) => {
    try {
      const { error } = await supabase
        .from('guns')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({ guns: state.guns.filter((gun) => gun.id !== id) }));
    } catch (error) {
      console.error('Error deleting gun:', error);
    }
  },

  clearGuns: () => set({ guns: [] }),
}));

export default useInventoryStore;