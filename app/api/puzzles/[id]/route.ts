import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Puzzle from '@/models/Puzzle';

// GET by ID
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // IMPORTANT: Await params in Next.js 15
    const { id } = await params;
    
    const puzzle = await Puzzle.findById(id);
    
    if (!puzzle) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
    }
    
    return NextResponse.json(puzzle);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch puzzle' }, { status: 500 });
  }
}

// PUT by ID (Update puzzle)
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await req.json();
    
    const puzzle = await Puzzle.findByIdAndUpdate(id, body, { new: true });
    
    if (!puzzle) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
    }
    
    return NextResponse.json(puzzle);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update puzzle' }, { status: 500 });
  }
}

// DELETE by ID
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const puzzle = await Puzzle.findByIdAndDelete(id);
    
    if (!puzzle) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Puzzle deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete puzzle' }, { status: 500 });
  }
}
