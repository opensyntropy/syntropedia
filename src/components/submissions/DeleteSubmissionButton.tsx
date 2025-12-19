'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteSubmissionButtonProps {
  submissionId: string
  speciesName: string
  translations: {
    delete: string
    confirmMessage: string
  }
}

export function DeleteSubmissionButton({
  submissionId,
  speciesName,
  translations: t,
}: DeleteSubmissionButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(t.confirmMessage.replace('{name}', speciesName))

    if (!confirmed) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/species/submissions/${submissionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/contributions')
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete')
        setIsDeleting(false)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete submission')
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 mr-2" />
      )}
      {t.delete}
    </Button>
  )
}
