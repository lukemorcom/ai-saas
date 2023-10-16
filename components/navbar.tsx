import { UserButton } from '@clerk/nextjs'
import MobileSidebar from '@/components/mobile-sidebar'

export default function NavBar() {
  return (
    <div className='flex items-center p-4'>
        <MobileSidebar />
        <div className='w-full flex justify-end'>
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}
