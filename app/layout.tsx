export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
