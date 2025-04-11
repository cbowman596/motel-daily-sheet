
import { createClient } from '@supabase/supabase-js';
import { RoomData, FooterValues } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Room data functions
export const saveRooms = async (rooms: RoomData[], userId: string) => {
  try {
    // First, delete existing rooms for this user to avoid duplicates
    await supabase
      .from('rooms')
      .delete()
      .eq('user_id', userId);
    
    // Then insert the new rooms
    const { data, error } = await supabase
      .from('rooms')
      .insert(rooms.map(room => ({
        ...room,
        user_id: userId
      })));
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving rooms:', error);
    return { success: false, error };
  }
};

export const loadRooms = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    return { success: true, data: data as RoomData[] };
  } catch (error) {
    console.error('Error loading rooms:', error);
    return { success: false, error, data: [] };
  }
};

// Footer values functions
export const saveFooterValues = async (values: FooterValues, userId: string) => {
  try {
    // Check if footer values already exist for this user
    const { data: existingData } = await supabase
      .from('footer_values')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('footer_values')
        .update({ ...values })
        .eq('user_id', userId);
        
      if (error) throw error;
      return { success: true, data };
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('footer_values')
        .insert([{ ...values, user_id: userId }]);
        
      if (error) throw error;
      return { success: true, data };
    }
  } catch (error) {
    console.error('Error saving footer values:', error);
    return { success: false, error };
  }
};

export const loadFooterValues = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('footer_values')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGSQL_ERROR_NO_DATA_FOUND') throw error;
    return { 
      success: true, 
      data: data as FooterValues || null
    };
  } catch (error) {
    console.error('Error loading footer values:', error);
    return { success: false, error, data: null };
  }
};
