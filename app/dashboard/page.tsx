import { PageHeader } from '@/components/dashboard/page-header'
import { CreateMessageForm } from '@/components/dashboard/create-message-form'

export default function CreateMessagePage() {
  return (
    <>
      <PageHeader
        title="Create Message"
        description="Write a secret, lock it with a code, and share it safely."
      />
      <CreateMessageForm />
    </>
  )
}
