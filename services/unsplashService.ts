import fetch from 'node-fetch';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  throw new Error('Missing Unsplash access key. Please add it to your environment variables.');
}

interface UnsplashImage {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashImage[];
}

export async function searchImages(query: string, perPage: number = 10): Promise<UnsplashImage[]> {
  const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching images: ${response.statusText}`);
  }

  const data: UnsplashSearchResponse = await response.json();
  return data.results;
}
