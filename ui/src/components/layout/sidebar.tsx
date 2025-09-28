'use client'

import Image from 'next/image'
import { Menu } from 'lucide-react'
import { sidebarSections, type SidebarItem } from '@/data/sidebar'
import { cn } from '@/lib/utils'
import SidebarGroup from '@/components/layout/sidebar-group'

export type SidebarProps = {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-slate-900 px-4 py-4 text-white shadow-inner h-full',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={60} height={60} />
        </div>
        <Menu className="h-6 w-6 text-slate-400" />
      </div>

      {/* Sidebar Sections */}
      <div className="flex flex-col gap-2">
        {sidebarSections.map(section => (
          <div key={section.id} className="">
            <SidebarGroup
              key={section.id}
              item={section?.items}
              heading={section?.heading}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
