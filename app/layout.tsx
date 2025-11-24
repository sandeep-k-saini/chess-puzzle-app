import './globals.css'

export const metadata = {
  title: 'Chess Puzzle Game',
  description: 'Interactive chess puzzle solving',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-custom">{children}</body>
    </html>
  )
}
