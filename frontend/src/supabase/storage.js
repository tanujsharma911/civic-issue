
import { supabase } from '../supabase/supabase-client';

export class StorageService {
  
  async uploadImage(file) {
    const { data, error } = await supabase.storage.from('images').upload(`public/${file.name}${Date.now()}`, file);

    if (error) {
      console.error('Error uploading image:', error);
      return { status: 'error', msg: error.message };
    }

    return { status: 'success', data };
  }

  getImageUrl(path) {
    const { data, error } = supabase.storage.from('images').getPublicUrl(path);

    if (error) {
      console.error('Error getting image URL:', error);
      return { status: 'error', msg: error.message };
    }

    return { status: 'success', data: data.publicUrl };
  }
}

const storageService = new StorageService();

export default storageService;