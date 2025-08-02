import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        passthrough: JSON.stringify({
          title: title || file.name,
          description: formData.get('description') as string || '',
          uploadedAt: new Date().toISOString()
        })
      },
      test: false,
    });

    const response = await fetch(upload.url, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': file.type || 'video/mp4',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Mux');
    }

    return NextResponse.json({
      uploadId: upload.id,
      assetId: upload.asset_id,
      title: title || file.name,
      status: 'uploaded'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' }, 
      { status: 500 }
    );
  }
}