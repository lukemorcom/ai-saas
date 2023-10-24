import { UserButton } from '@clerk/nextjs'
import MobileSidebar from '@/components/mobile-sidebar'
import { getApiLimitCount } from '@/lib/api-limit'

export default async function NavBar() {
  const apiLimitCount = await getApiLimitCount();

  return (
    <div className='flex items-center p-4'>
        <MobileSidebar apiLimitCount={apiLimitCount}/>
        <div className='w-full flex justify-end'>
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}
