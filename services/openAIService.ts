export async function generateTemplate(messages: Array<{ role: string; content: string }>) {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: messages
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch completion');
  }

  const data = await response.json();
  return data;
}
