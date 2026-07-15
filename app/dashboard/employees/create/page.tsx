
import { CreaeteEmployeeForm } from '@/components/dashboard/employees/CreaeteEmployeeForm'
import { Topbar } from '@/components/dashboard/Topbar'

const page = () => {
    return (
        <div className='px-4 space-y-4' >
            <Topbar title=' إضافة موظف جديد  ' />
            <CreaeteEmployeeForm />
        </div>
    )
}

export default page