import mongoose, { Schema, Model } from 'mongoose';

export interface IPuzzle {
  fen: string;
  goalText: string;
  hints: string[];
  solution: string[];
  playerColor: 'white' | 'black';
  difficulty: number;
  createdAt: Date;
}

const PuzzleSchema = new Schema<IPuzzle>({
  fen: { type: String, required: true },
  goalText: { type: String, required: true },
  hints: [{ type: String }],
  solution: [{ type: String }],
  playerColor: { type: String, enum: ['white', 'black'], default: 'white' },
  difficulty: { type: Number, min: 1, max: 5, default: 3 },
  createdAt: { type: Date, default: Date.now }
});

const Puzzle: Model<IPuzzle> = mongoose.models.Puzzle || mongoose.model<IPuzzle>('Puzzle', PuzzleSchema);

export default Puzzle;
