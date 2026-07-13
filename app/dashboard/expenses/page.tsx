import EmptyExpenses from '@/components/dashboard/expenses/EmptyExpenses'
import ExpenseSettlement from '@/components/dashboard/expenses/ExpenseSettlement'
import { ExpensesTableSection } from '@/components/dashboard/expenses/ExpensesTableSection'
import { ExpenseStatsSection } from '@/components/dashboard/expenses/ExpenseStatsSection'
import { Topbar } from '@/components/dashboard/Topbar'
import { EXPENSE_STATS, EXPENSES } from '@/data/data'

const page = () => {
  return (
    <div className='px-4 space-y-4' >
      <Topbar title='إضافة مصروف' />
      {/* <EmptyExpenses /> */}
      <ExpenseStatsSection stats={EXPENSE_STATS} />
      <ExpenseSettlement />
      <ExpensesTableSection data={EXPENSES} totalRecords={148} />
     </div>
  )
}

export default page