import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const assets = await mux.video.assets.list({
      limit,
      page,
    });

    const videos = assets.data
      .filter(asset => 
        asset.status === 'ready' && 
        asset.playback_ids && 
        asset.playback_ids.length > 0
      )
      .filter(asset => {
        if (!search) return true;
        const metadata = asset.passthrough ? JSON.parse(asset.passthrough) : {};
        const title = metadata.title || asset.id;
        const description = metadata.description || '';
        return title.toLowerCase().includes(search.toLowerCase()) ||
               description.toLowerCase().includes(search.toLowerCase()) ||
               asset.id.toLowerCase().includes(search.toLowerCase());
      })
      .map(asset => {
        const metadata = asset.passthrough ? JSON.parse(asset.passthrough) : {};
        return {
          id: asset.id,
          playbackId: asset.playback_ids![0].id,
          policy: asset.playback_ids![0].policy,
          status: asset.status,
          duration: asset.duration,
          aspectRatio: asset.aspect_ratio,
          createdAt: asset.created_at,
          title: metadata.title || asset.id,
          description: metadata.description || '',
        };
      });

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total: assets.data.length,
      }
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' }, 
      { status: 500 }
    );
  }
}