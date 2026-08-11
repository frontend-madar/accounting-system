import { VendorsTableSection } from '@/components/dashboard/suppliers/Vendorstablesection'
import { Topbar } from '@/components/dashboard/Topbar'
 

const page = () => {
    return (
        <div className='px-4 space-y-4' >
            <Topbar title='الموردين' search />
            <VendorsTableSection   />
        </div>

    )
}

export default page