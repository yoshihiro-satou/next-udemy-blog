import { writeFile } from 'fs/promises'
import Path from 'path'

export async function saveImage(file: File): Promise<string | null>{
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
