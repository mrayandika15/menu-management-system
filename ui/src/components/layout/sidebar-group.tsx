'use client'

import SidebarItems from '@/components/layout/sidebar-item'
import { SidebarItem } from '@/data/sidebar'
import { cn } from '@/lib/utils'
import { Folder, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

function SidebarGroup({
  item,
  heading,
}: {
  item: SidebarItem[]
  heading: string
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={cn('w-full rounded-xl', isExpanded ? 'bg-slate-800' : '')}>
      <div
        onClick={handleClick}
        className={cn(
          'flex items-center justify-between gap-3 cursor-pointer px-3 py-3 rounded-lg transition-colors',
          isExpanded ? ' text-white' : 'text-slate-400 hover:text-slate-200',
        )}
      >
        <div className="flex items-center gap-3">
          <Folder className="h-4 w-4" />
          <span className="text-[14px] font-semibold">{heading}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 flex flex-col gap-1">
          {item.map(item => (
            <SidebarItems key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SidebarGroup
