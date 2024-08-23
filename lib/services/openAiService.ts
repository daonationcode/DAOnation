import OpenAI from 'openai';
import { UnsplashService } from './unsplashService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class OpenAiService {
  static async generateTemplate(description: string) {
    const unsplashImageUrl = await UnsplashService.searchImages(description).then((images) => images[0].urls.full);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a HTML generation assistant. You only return HTML content. This content does not require html, head or body tags as those are already added manually.' },
        {
          role: 'user',
          content: `Generate a HTML template with a header and 2 paragraphs for a DAO based on the following description: ${description}. Also add an img tag underneath for the following url ${unsplashImageUrl}`
        }
      ]
    });

    return completion;
  }

  static async generateGoal(goalDescription: string, daoDescription: string) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a assistent to phrase goals well and give them a proper name. You only return a stringified json object that can be parsed with JSON.parse that has a title and description. No markdown or any other fluff.' },
        {
          role: 'user',
          content: `Generate a goal with name and description based on the following description: ${goalDescription}. Take into account the desciption of the charity: ${daoDescription}`
        }
      ]
    });

    return completion;
  }

  static async generateIdeas(goalDescription: string, daoDescription: string) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a idea generation assistant. You return 3 ideas based on a goal description as an array with a string for each. Omit any markdown, it should be a stringified JSON that Javascript can JSON.parse directly.' },
        {
          role: 'user',
          content: `Generate 3 realistic ideas a charity with the following description ${daoDescription} could try to implement to achieve the following goal: ${goalDescription}. `
        }
      ]
    });

    return completion;
  }
}
