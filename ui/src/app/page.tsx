'use client'

import { PageHeader } from '@/components/layout/page-header'
import { Sidebar } from '@/components/layout/sidebar'
import { MenuForm } from '@/components/menu/menu-form'
import { MenuTreePreview } from '@/components/menu/menu-tree-preview'

export default function HomePage() {
  // Event handlers for page interactions
  const handleExpandAll = () => {
    // TODO: Implement expand all functionality
    console.log('Expand all clicked')
  }

  const handleCollapseAll = () => {
    // TODO: Implement collapse all functionality
    console.log('Collapse all clicked')
  }

  const handleMenuSelect = (menu: string) => {
    // TODO: Implement menu selection functionality
    console.log('Menu selected:', menu)
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save clicked')
  }

  const handleAddMenu = () => {
    // TODO: Implement add menu functionality
    console.log('Add menu clicked')
  }

  return (
    <main className="mx-auto grid min-h-screen grid-cols-[260px_1fr] gap-6 px-6 py-8 text-slate-900">
      {/* Left sidebar area */}
      <Sidebar />

      {/* Main content area */}
      <section className="flex flex-col gap-6">
        {/* Page header with title and action buttons */}
        <PageHeader
          title="Menus"
          subtitle="System management"
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Menu form section */}
          <MenuForm
            selectedMenu="system management"
            menuId="56320ee9-6af6-11ed-a7ba-f220afe5e4a9"
            depth="3"
            parentData="Systems"
            name="System Code"
            onMenuSelect={handleMenuSelect}
            onSave={handleSave}
          />

          {/* Menu tree preview section */}
          <MenuTreePreview
            title="Menu Tree Preview"
            onAddMenu={handleAddMenu}
          />
        </div>
      </section>
    </main>
  )
}
