import MainButton from '@/components/dashboard/MainButton'
import { PayrollDetailTableSection } from '@/components/dashboard/payroll/Payrolldetailtablesection'
import SecondaryButton from '@/components/dashboard/SecondaryButton'
import { Topbar } from '@/components/dashboard/Topbar'
import { payrollDetails } from '@/data/data'
import { Download, Plus } from 'lucide-react'
 
const PayrollDetaolsPage = () => {
  return (
    <div className='px-4 space-y-4' >
      <Topbar
        title=""
        path='قائمة المرتبات'
        nestedLink="تفاصيل مسير رواتب"
        nestedLinkPath=' payroll-details'
        middleNestedLink='تشغيل مسير رواتب'
        middleNestedLinkPath='/dashboard/payroll' />
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className='text-center' >
            <h2 className="text-[24px] font-bold text-[#0F1219]">
              تفاصيل مسير الرواتب
            </h2>
            <p className="mt-1 font-medium text-[16px] text-[#676A6E]">
              فترة ٠١ – ٣٠ يونيو ٢٠٢٦ · ٣٤٢ موظف
            </p>
          </div>

          <div className='flex flex-col md:flex-row items-center justify-center gap-3' >
            <SecondaryButton
              text={'تصدير'}
              icon={<Download className="h-4 w-4" />}
              className='md:!w-[110px] !w-[100%]'
            />
            <MainButton
              text={'اعتماد الرواتب'}
              className='md:!w-[246px] !w-[100%]'
            />
          </div>
        </div>
      </div>
      <PayrollDetailTableSection
        data={payrollDetails}
        totalRecords={148}
      />
    </div>
  )
}

export default PayrollDetaolsPage
