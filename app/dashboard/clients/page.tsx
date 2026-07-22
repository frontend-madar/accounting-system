import { ClientsTableSection } from "@/components/dashboard/clients/ClientsTableSection"
import { Topbar } from "@/components/dashboard/Topbar"

const page = () => {
  return (
    <div className="px-4 space-y-4" >
      <Topbar title='ادارة العملاء' />
      <ClientsTableSection />
    </div>
  )
}

export default page