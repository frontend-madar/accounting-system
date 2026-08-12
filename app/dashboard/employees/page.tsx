import { EmployeesTableSection } from '@/components/dashboard/employees/EmployeesTableSection'
import { Topbar } from '@/components/dashboard/Topbar'

const page = () => {
    return (
        <div className='px-4 space-y-4' >
            <Topbar title='ادارة الموظفين' />
            
            <EmployeesTableSection />
        </div>
    )
}

export default page