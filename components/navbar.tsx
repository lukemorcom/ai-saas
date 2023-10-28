import { UserButton } from '@clerk/nextjs'
import MobileSidebar from '@/components/mobile-sidebar'
import { getApiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription';

export default async function NavBar() {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className='flex items-center p-4'>
        <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount}/>
        <div className='w-full flex justify-end'>
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}
