import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Max file size: 25MB for video, 5MB for image
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 30 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
];

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload PNG, JPG, WEBP, MP4, or WebM.' },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith('video/');
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: 'Video file size exceeds maximum limit of 30MB.' },
        { status: 400 }
      );
    }

    if (!isVideo && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'Image file size exceeds maximum limit of 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/assets/uploads/[folder]/
    const uploadDir = path.join(process.cwd(), 'public', 'assets', 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name) || (isVideo ? '.mp4' : '.png');
    const safeBase = file.name
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 20);
    const fileName = `${Date.now()}_${safeBase}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/assets/uploads/${folder}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: 'File upload failed.' }, { status: 500 });
  }
}
