import { NextResponse } from 'next/server';
import { connect } from '@/utils/connect.js';
import { currentUser } from '@clerk/nextjs/server';

// POST route to add a plant to a space
export async function POST(req) {
  const db = connect();
  try {
    const { apiId, spaceId } = await req.json();
    const userId = (await currentUser()).id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!apiId || !spaceId) {
      return NextResponse.json(
        { error: 'Plant ID and space ID are required' },
        { status: 400 }
      );
    }

    // Verify the space belongs to the user
    const spaceCheck = await db.query(
      'SELECT id FROM pi_spaces WHERE id = $1 AND user_id = $2',
      [spaceId, userId]
    );

    if (spaceCheck.rowCount === 0) {
      return NextResponse.json(
        { error: "Space not found or doesn't belong to user" },
        { status: 404 }
      );
    }

    // Verify the plant ID by fetching details from ZylaLabs API
    try {
      // Get API key from environment variables
      const apiKey = process.env.ZYLALABS_API_KEY;

      if (!apiKey) {
        console.error('Missing ZYLALABS_API_KEY environment variable');
        throw new Error('API key not configured');
      }

      const url = `https://zylalabs.com/api/774/house+plants+database+api/510/get+plant+by+id?plant_id=${apiId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Invalid plant ID or API error' },
          { status: 400 }
        );
      }

      // Get plant details from API for additional information
      const plantData = await response.json();

      // Extract data for our schema
      let name = '';
      if (plantData['Latin name']) {
        name = plantData['Latin name'];
      } else if (
        plantData['Common name'] &&
        Array.isArray(plantData['Common name']) &&
        plantData['Common name'].length > 0
      ) {
        name = plantData['Common name'][0];
      }

      // Extract temperature values
      let temperature = null;
      if (
        plantData['Temperature min'] &&
        plantData['Temperature min']['C'] &&
        plantData['Temperature max'] &&
        plantData['Temperature max']['C']
      ) {
        const minTemp = plantData['Temperature min']['C'];
        const maxTemp = plantData['Temperature max']['C'];
        temperature = (minTemp + maxTemp) / 2;
      }

      // Extract brightness from light values - keep the raw LUX value
      let brightness = null;
      if (plantData['Light ideal']) {
        const lightInfo = plantData['Light ideal'];
        // Extract numeric values from the light description
        const matches = lightInfo.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g);
        if (matches && matches.length >= 2) {
          // Format is usually "Strong light ( 21,500 to 3,200 lux/2000 to 300 fc)"
          const values = matches.map((m) => parseInt(m.replace(/,/g, '')));
          const minLight = Math.min(...values);
          const maxLight = Math.max(...values);
          // Use average LUX value
          brightness = Math.floor((minLight + maxLight) / 2);
        }
      }

      // Get image URL
      const imageUrl = plantData.Img || '';

      // Insert the new plant with all available data
      const result = await db.query(
        'INSERT INTO pi_plants (api_id, space_id, name, temperature, brightness, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, api_id, space_id, watered, name, temperature, brightness, image_url;',
        [apiId, spaceId, name, temperature, brightness, imageUrl]
      );

      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      console.error('Error processing plant details:', error);

      // If we can't get details from the API, just insert the basic info
      const result = await db.query(
        'INSERT INTO pi_plants (api_id, space_id) VALUES ($1, $2) RETURNING id, api_id, space_id, watered;',
        [apiId, spaceId]
      );

      return NextResponse.json(result.rows[0], { status: 201 });
    }
  } catch (error) {
    console.error('Error adding plant:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
