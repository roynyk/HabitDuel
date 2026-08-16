import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
// Mengutamakan service_role key untuk akses upload server tanpa terhalang RLS policy
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Mengunggah gambar (Base64 Data URL) ke Supabase Storage Bucket 'proofs'
 * Mengembalikan URL publik gambar permanen dari Supabase Storage
 */
export async function uploadImageToSupabaseStorage(
  base64DataUrl: string,
  fileNamePrefix: string = 'proof'
): Promise<string> {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('SUPABASE_URL atau SUPABASE_ANON_KEY belum terkonfigurasi di .env');
      return base64DataUrl;
    }

    // Jika sudah berupa URL publik HTTP/HTTPS, kembalikan langsung
    if (base64DataUrl.startsWith('http://') || base64DataUrl.startsWith('https://')) {
      return base64DataUrl;
    }

    // Ekstrak mime type dan string base64
    const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
    let contentType = 'image/png';
    let base64String = base64DataUrl;

    if (matches && matches.length === 3) {
      contentType = matches[1] || 'image/png';
      base64String = matches[2] || '';
    }

    const fileExt = contentType.split('/')[1] || 'png';
    const filePath = `${fileNamePrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    // Konversi base64 ke Buffer
    const fileBuffer = Buffer.from(base64String, 'base64');

    // Upload buffer ke Supabase Storage bucket 'proofs'
    const { data, error } = await supabase.storage
      .from('proofs')
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Supabase Storage Upload Warning:', error.message);
      return base64DataUrl;
    }

    // Ambil Public URL permanen
    const { data: publicUrlData } = supabase.storage
      .from('proofs')
      .getPublicUrl(data.path);

    console.log('✅ Foto berhasil disimpan di Supabase Storage:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error('Gagal mengunggah foto ke Supabase Storage:', err);
    return base64DataUrl;
  }
}
