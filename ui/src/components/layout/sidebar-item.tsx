'use client'

import { AppWindow } from 'lucide-react'
import { SidebarItem } from '@/data/sidebar'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const SidebarItems = ({ item }: { item: SidebarItem }) => {
  const [isActive, setIsActive] = useState(false)

  const hasSubItems = item?.items && item.items.length > 0

  return (
    <div>
      <div
        onClick={() => setIsActive(!isActive)}
        className={cn(
          'flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
          isActive && !hasSubItems 
            ? 'text-slate-900 font-semibold' 
            : 'text-slate-400 hover:text-slate-200',
        )}
        style={{
          backgroundColor: isActive && !hasSubItems ? '#9FF443' : 'transparent'
        }}
      >
        <AppWindow className="h-4 w-4" />
        <span className="text-[14px] font-semibold">
          {item.label}
        </span>
      </div>
    </div>
  )
}

export default SidebarItems
