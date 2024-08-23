export class OpenAiService {
  static async generateTemplate(daoDescription: string) {
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

  static async generateGoal(goalDescription: string, daoDescription): Promise<{ content: string }> {
    const response = await fetch('/api/openai/generateGoal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        goalDescription,
        daoDescription
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch completion');
    }

    const data = await response.json();
    return data;
  }

  static async generateIdeas(goalDescription: string, daoDescription) {
    const response = await fetch('/api/openai/generateIdeas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        goalDescription,
        daoDescription
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch completion');
    }

    const data = await response.json();
    return data;
  }
}
