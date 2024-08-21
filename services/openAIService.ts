export async function generateTemplate(daoDescription: string) {
  const response = await fetch('/api/openai/generateTemplate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      daoDescription
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch completion');
  }

  const data = await response.json();
  return data;
}
