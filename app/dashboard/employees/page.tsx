import { EmployeesTableSection } from '@/components/dashboard/employees/EmployeesTableSection'
import { EMPLOYEES } from '@/data/data'
import { Topbar } from '@/components/dashboard/Topbar'
import StaffDownsizing from '@/components/dashboard/employees/StaffDownsizing'

const page = () => {
    return (
        <div className='px-4 space-y-4' >
            <Topbar title='ادارة الموظفين' />
            
            <EmployeesTableSection />
        </div>
    )
}

export default page