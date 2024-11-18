export const metadata = {
  title: 'Sensex Pulse API',
  description: 'Report Generation Service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
