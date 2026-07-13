import { CreateCreditAccountForm } from '@/components/dashboard/credit-accounts/CreateCreditAccountForm'
import { Topbar } from '@/components/dashboard/Topbar'
import React from 'react'

const page = () => {
  return (
    <div  className='space-y-4 px-4' >
         <Topbar path='الحسابات الآجلة / إضافة حساب جديد' title="" userName="mohamed ali" />

         <CreateCreditAccountForm />
    </div>
  )
}

export default page