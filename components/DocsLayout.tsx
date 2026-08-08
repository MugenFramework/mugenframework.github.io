'use client'

import { useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <style>{`
        .docs-content {
          padding-top: var(--navbar-height);
          padding-left: var(--sidebar-width);
          min-height: 100vh;
        }
        @media (max-width: 1023px) {
          .docs-content {
            padding-left: 0;
          }
        }
      `}</style>
      <Navbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="docs-content">
        {children}
      </div>
    </>
  )
}
