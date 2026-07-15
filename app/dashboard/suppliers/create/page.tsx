import { CreateVendorForm } from '@/components/dashboard/suppliers/CreateVendorForm'
import { Topbar } from '@/components/dashboard/Topbar'

const page = () => {
  return (
    <div className='px-4 space-y-4'>
      <Topbar title='' search={true} path=' إضافة مورد' />
      <CreateVendorForm />
    </div>
  )
}

export default page