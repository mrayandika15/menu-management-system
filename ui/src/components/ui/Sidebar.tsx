import Image from 'next/image'
import { Menu } from 'lucide-react'

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-[#101828]">
      <div className="w-full flex-col gap-2 p-2">
        <div className="flex justify-between w-full items-center">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <Menu className="h-6 w-6 text-icon" />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
