import { NextRequest, NextResponse } from 'next/server';
import { makeSmartMove } from '@/lib/chessAI';

export async function POST(req: NextRequest) {
  try {
    const { fen } = await req.json();
    const newFen = makeSmartMove(fen);
    
    return NextResponse.json({ fen: newFen });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate move' }, { status: 500 });
  }
}
