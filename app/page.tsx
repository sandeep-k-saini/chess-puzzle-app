import ChessGame from '@/components/ChessGame';
import Sidebar from '@/components/SideBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 ">
      <Sidebar />
      <ChessGame />
    </main>
  );
}
