import { PageHeader } from '@/components/dashboard/page-header'
import { UnlockForm } from '@/components/landing/unlock-form'

export default function SearchMessagePage() {
  return (
    <>
      <PageHeader
        title="Search Message"
        description="Enter a secret code to open a message someone shared with you."
      />
      <div className="max-w-xl">
        <UnlockForm />
      </div>
    </>
  )
}
