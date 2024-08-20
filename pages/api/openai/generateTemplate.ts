import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { searchImages } from '../../../lib/services/unsplashService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { daoDescription } = req.body;

    if (!daoDescription || typeof daoDescription !== 'string') {
      return res.status(400).json({ message: 'daoDescription is required and must be a string' });
    }

    const unsplashImageUrl = await searchImages(daoDescription).then((images) => images[0].urls.full);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a HTML generation assistant. You only return HTML content. This content does not require html, head or body tags as those are already added manually.' },
        {
          role: 'user',
          content: `Generate a HTML template with a header and 2 paragraphs for a DAO based on the following description: ${daoDescription}. Also add an img tag underneath for the following url ${unsplashImageUrl}`
        }
      ]
    });

    res.status(200).json(completion.choices[0].message);
  } catch (error) {
    res.status(500).json({ message: 'Error with OpenAI API', error: error.message });
  }
}
