import { OrganizationSwitcher } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

const OrganizationIdPage = async ({ params }: { params: string }) => {
  const { userId, orgId } = await auth()
  return <div></div>
}
export default OrganizationIdPage
