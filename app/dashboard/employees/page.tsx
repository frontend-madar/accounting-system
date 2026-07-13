import { EmployeesTableSection } from '@/components/dashboard/employees/EmployeesTableSection'
import { EMPLOYEES } from '@/data/data'
import React from 'react'
import { Topbar } from '@/components/dashboard/Topbar'

const page = () => {
    return (
        <div className='px-4 space-y-4' >
            <Topbar title='ادارة الموظفين' />
            <EmployeesTableSection data={EMPLOYEES} totalRecords={148} />
        </div>
    )
}

export default page