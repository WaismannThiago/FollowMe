import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Sistema de gerenciamento de tarefas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
