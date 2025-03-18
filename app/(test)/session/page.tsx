'use client'

import PrimaryButton from '@/components/button/primary-button';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function SessionDebugger() {
  const { data: session, status } = useSession()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <div className="mt-8 m-4 p-4 b-200 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Session Status: {status}</h2>

        {status === 'authenticated' && (
          <>
            <div className="mb-2">
              <span className="font-medium">User:</span> {session?.user?.name} (
              {session?.user?.email})
            </div>

            <PrimaryButton
              onClick={() => setShowDetails(!showDetails)}
              className=""
            >
              {showDetails ? 'Hide' : 'Show'} Session Details
            </PrimaryButton>

            {showDetails && (
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-60">
                {JSON.stringify(session, null, 2)}
              </pre>
            )}
          </>
        )}

        {status === 'unauthenticated' && <p>You are not signed in.</p>}

        {status === 'loading' && <p>Loading session...</p>}
      </div>

    </>
  )
}
