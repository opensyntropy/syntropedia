import { redirect } from 'next/navigation'

interface ReviewPageProps {
  params: Promise<{ locale: string; id: string }>
}

// Redirect to the edit page - reviewers now use the same edit form
export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params
  redirect(`/contributions/${id}?edit=true`)
}
