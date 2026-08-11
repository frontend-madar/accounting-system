import { CreateCreditAccountForm } from '@/components/dashboard/credit-accounts/CreateCreditAccountForm'
import { Topbar } from '@/components/dashboard/Topbar'
import React from 'react'

const page = () => {
  return (
    <div  className='space-y-4 px-4' >
         <Topbar  title="الحسابات الآجلة" />

         <CreateCreditAccountForm />
    </div>
  )
}

export default page