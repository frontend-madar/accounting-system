import { CreditAccountsTableSection } from '@/components/dashboard/credit-accounts/CreditAccountsTableSection'
import { Topbar } from '@/components/dashboard/Topbar'
import { CREDIT_ACCOUNTS } from '@/data/data'
 
const page = () => {
  return (
    <div className='space-y-4 px-4' >
      <Topbar title="   الحسابات الآجلة  "  />
      <div className="rounded-2xl ctm-shadow bg-white p-5">
        <CreditAccountsTableSection data={CREDIT_ACCOUNTS} />
      </div>
    </div>
  )
}

export default page