export async function GET() {
  return new Response(JSON.stringify({ nodeVersion: process.version }), {
    headers: { 'Content-Type': 'application/json' },
  });
}