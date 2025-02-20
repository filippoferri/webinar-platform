export default function DebugPage() {
    return (
      <div>
        <h1>Debug Page</h1>
        <p>This page is working!</p>
        <h2>Environment Variables:</h2>
        <pre>{JSON.stringify({
          ADMIN_USERNAME: process.env.ADMIN_USERNAME,
          SENDFOX_AUTHORIZATION_CODE: process.env.SENDFOX_AUTHORIZATION_CODE ? 
            'Present (truncated)' : 'Not set'
        }, null, 2)}</pre>
      </div>
    )
  }