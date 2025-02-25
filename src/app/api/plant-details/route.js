import { NextResponse } from 'next/server';

// GET route to fetch plant details by ID
export async function GET(req) {
  try {
    // Get plant ID from the URL query params
    const { searchParams } = new URL(req.url);
    const plantId = searchParams.get('id');

    if (!plantId) {
      return NextResponse.json(
        { error: 'Plant ID is required' },
        { status: 400 }
      );
    }

    // Get plant details from ZylaLabs API
    const plantDetails = await getPlantDetailsFromAPI(plantId);
    return NextResponse.json(plantDetails, { status: 200 });
  } catch (error) {
    console.error('Error fetching plant details:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

// Function to get plant details from the ZylaLabs API
async function getPlantDetailsFromAPI(id) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.ZYLALABS_API_KEY;

    if (!apiKey) {
      console.error('Missing ZYLALABS_API_KEY environment variable');
      throw new Error('API key not configured');
    }

    // Form the API request URL
    const url = `https://zylalabs.com/api/774/house+plants+database+api/510/get+plant+by+id?plant_id=${id}`;
    console.log(`Fetching plant details for ID: ${id}`);

    // Create the API request with proper authorization
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `API request failed with status ${response.status}: ${errorText}`
      );
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    // Calculate brightness from light values
    let brightness = null;
    if (result['Light ideal']) {
      const lightInfo = result['Light ideal'];
      // Extract numeric values from the light description
      const matches = lightInfo.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g);
      if (matches && matches.length >= 2) {
        // Format is usually "Strong light ( 21,500 to 3,200 lux/2000 to 300 fc)"
        const values = matches.map((m) => parseInt(m.replace(/,/g, '')));
        minLight = Math.min(...values);
        maxLight = Math.max(...values);
        brightness = Math.floor((minLight + maxLight) / 2);
      }
    }

    // Extract temperature values
    let temperature = null;

    if (
      result['Temperature min'] &&
      result['Temperature min']['C'] &&
      result['Temperature max'] &&
      result['Temperature max']['C']
    ) {
      const minTemp = result['Temperature min']['C'];
      const maxTemp = result['Temperature max']['C'];
      temperature = (minTemp + maxTemp) / 2;
    }

    // Process the results into the format we need
    const careInfo = {
      watering: result['Watering'] || 'Unknown',
      minLight: minLight,
      maxLight: maxLight,
      brightness: brightness,
    };

    // Return formatted plant details
    return {
      id: result.id || id,
      name: result['Latin name'] || '',
      commonName: Array.isArray(result['Common name'])
        ? result['Common name'][0]
        : '',
      image: result.Img || null,
      careInfo: careInfo,
      temperature: temperature,
      description: result.Description || '',
      category: result.Categories || '',
      origin: Array.isArray(result.Origin)
        ? result.Origin.join(', ')
        : result.Origin || '',
      climat: result.Climat || '',
    };
  } catch (error) {
    console.error('Error in getPlantDetailsFromAPI:', error);
    throw error;
  }
}
