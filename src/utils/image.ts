import { writeFile } from 'fs/promises'
import Path from 'path'
import { supabase } from '@/lib/supabase'

export async function saveImage(file: File): Promise<string | null>{
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE_STORAGE === 'true';
  if (useSupabase) {
  return await saveImageToSupabase(file);
  } else {
  return await saveImageToLocal(file);
  }
}

export async function saveImageToLocal(file: File): Promise<string | null> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${Date.now()}_${file.name}`
  const uploadDir = Path.join(process.cwd(), 'public/images')

  try {
    const filePath = Path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)
    return `/images/${fileName}`
  } catch(error) {
    console.error('画像保存エラー', error)
    return null
  }
}
async function saveImageToSupabase(file: File): Promise<string | null> {
  // file.nameがundefinedの場合のフォールバック
  let originalName = file.name || 'unknown';
  if (originalName === 'unknown' && file.type) {
    // MIMEタイプから拡張子を推測 (例: image/jpeg → jpg)
    const extMap: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      // 必要に応じて追加
    };
    const ext = extMap[file.type] || 'bin'; // 未知ならbin
    originalName = `image.${ext}`;
  }

  const fileName = `${Date.now()}_${originalName}`;

  const { error } = await supabase.storage
    .from('udemy_next_blog_bucket')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('udemy_next_blog_bucket')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
