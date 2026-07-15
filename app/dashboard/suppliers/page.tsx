import { VendorsTableSection } from '@/components/dashboard/suppliers/Vendorstablesection'
import { Topbar } from '@/components/dashboard/Topbar'
import { vendors } from '@/data/data'
import React from 'react'

const page = () => {
    return (
        <div className='px-4 space-y-4' >
            <Topbar title='الموردين' search />
            <VendorsTableSection data={vendors} totalRecords={vendors.length} />
        </div>

    )
}

export default page