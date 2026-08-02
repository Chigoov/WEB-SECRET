import { PageHeader } from '@/components/dashboard/page-header'
import { VaultTable } from '@/components/dashboard/vault-table'
import { getUserVaultMessages } from '@/app/actions/messages'

export const dynamic = 'force-dynamic'

export default async function VaultPage() {
  const messages = await getUserVaultMessages()

  return (
    <>
      <PageHeader
        title="My Vault"
        description="Every message you have locked, with its current status."
      />
      <VaultTable messages={messages} />
    </>
  )
}
