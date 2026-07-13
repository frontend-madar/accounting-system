import { CreateExpenseForm } from '@/components/dashboard/expenses/CreateExpenseFrom'
import { Topbar } from '@/components/dashboard/Topbar'
import React from 'react'

const page = () => {
  return (
    <div className='px-4 space-y-4' >
       <Topbar title='إضافة مصروف' />
       <CreateExpenseForm />
    </div>
  )
}

export default page