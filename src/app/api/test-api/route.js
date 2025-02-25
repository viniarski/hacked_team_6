import { NextResponse } from 'next/server';

// GET route to test the ZylaLabs API
export async function GET(req) {
  try {
    // Get test type from the URL query params
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'search';
    const query = searchParams.get('query') || 'monstera';
    const id = searchParams.get('id') || '215b33f4-66d2-5601-b776-4501f2bd50b7';

    let result;

    if (type === 'search') {
      // Test search API
      result = await testSearch(query);
    } else if (type === 'details') {
      // Test details API
      result = await testDetails(id);
    } else {
      return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json(
      { error: 'Test failed', message: error.message },
      { status: 500 }
    );
  }
}

// Function to test the search API
async function testSearch(query) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.ZYLALABS_API_KEY;

    if (!apiKey) {
      console.error('Missing ZYLALABS_API_KEY environment variable');
      throw new Error('API key not configured');
    }

    const url = `https://zylalabs.com/api/774/house+plants+database+api/509/search?query=${encodeURIComponent(
      query
    )}`;
    console.log(`Testing search API with query "${query}"`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed with status ${response.status}: ${errorText}`
      );
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error testing search API:', error);
    throw error;
  }
}

// Function to test the details API
async function testDetails(id) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.ZYLALABS_API_KEY;

    if (!apiKey) {
      console.error('Missing ZYLALABS_API_KEY environment variable');
      throw new Error('API key not configured');
    }

    const url = `https://zylalabs.com/api/774/house+plants+database+api/510/get+plant+by+id?plant_id=${id}`;
    console.log(`Testing details API with ID ${id}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed with status ${response.status}: ${errorText}`
      );
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error testing details API:', error);
    throw error;
  }
}
