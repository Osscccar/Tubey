import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const asset = await mux.video.assets.retrieve(id);
    
    if (!asset || asset.status !== 'ready' || !asset.playback_ids || asset.playback_ids.length === 0) {
      return NextResponse.json({ error: 'Video not found or not ready' }, { status: 404 });
    }

    const metadata = asset.passthrough ? JSON.parse(asset.passthrough) : {};
    const video = {
      id: asset.id,
      playbackId: asset.playback_ids[0].id,
      policy: asset.playback_ids[0].policy,
      status: asset.status,
      duration: asset.duration,
      aspectRatio: asset.aspect_ratio,
      createdAt: asset.created_at,
      title: metadata.title || asset.id,
      description: metadata.description || '',
    };

    return NextResponse.json({ video });

  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' }, 
      { status: 500 }
    );
  }
}