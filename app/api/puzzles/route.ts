import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Puzzle from '@/models/Puzzle';

// GET: Fetch random puzzle
export async function GET() {
  try {
    await connectDB();
    const count = await Puzzle.countDocuments();
    const random = Math.floor(Math.random() * count);
    const puzzle = await Puzzle.findOne().skip(random);
    
    return NextResponse.json(puzzle);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch puzzle' }, { status: 500 });
  }
}

// POST: Create new puzzle (Admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const puzzle = await Puzzle.create(body);
    
    return NextResponse.json(puzzle, { status: 201 });
  } catch (error) {
    console.error('Error creating puzzle:', error);
    return NextResponse.json({ error: 'Failed to create puzzle' }, { status: 500 });
  }
}
