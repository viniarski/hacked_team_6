import { NextResponse } from "next/server";
import { connect } from "@/utils/connect.js";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  const db = connect();
  try {
    const { searchParams } = new URL(req.url);
    const hours = parseInt(searchParams.get('hours') || '24'); // Default to 24 hours
    const plantId = searchParams.get('plantId'); // Optional plantId filter
    
    const user = await currentUser();
    const userId = user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the latest data entries
    const metricsQuery = `
      SELECT 
        id,
        temperature,
        humidity,
        pressure,
        brightness,
        collected_at
      FROM pi_data
      ORDER BY collected_at DESC
      LIMIT 24;
    `;
    
    const result = await db.query(metricsQuery);
    
    // Create placeholder data for a full 24-hour period
    const currentHour = new Date().getHours();
    const placeholderData = [];
    
    // Generate hours in sequence from current hour backward through the day
    for (let i = 0; i < 24; i++) {
      // Calculate hour (going backward from current hour)
      const hour = (currentHour - i + 24) % 24;
      
      placeholderData.push({
        hour: hour,
        temperature: null,
        humidity: null,
        brightness: null,
        hasData: false
      });
    }
    
    // Fill in actual data where available
    const processedRows = result.rows.map(row => {
      const timestamp = new Date(row.collected_at);
      const hour = timestamp.getHours();
      
      // Use humidity directly without conversion
      const humidityValue = row.humidity || 0;
      
      // Use the brightness value multiplied by 10 to convert to lux
      const brightnessLux = row.brightness ? row.brightness * 100 : 0;
      
      return {
        id: row.id,
        hour: hour,
        temperature: row.temperature,
        humidity: humidityValue,
        brightness: brightnessLux,
        pressure: row.pressure,
        timestamp: row.collected_at,
        hasData: true
      };
    });
    
    // Merge actual data into placeholder data
    processedRows.forEach(dataPoint => {
      const placeholderIndex = placeholderData.findIndex(p => p.hour === dataPoint.hour);
      if (placeholderIndex !== -1) {
        // If we already have data for this hour, only replace if new data is more recent
        if (!placeholderData[placeholderIndex].hasData || 
            (placeholderData[placeholderIndex].timestamp && 
             new Date(dataPoint.timestamp) > new Date(placeholderData[placeholderIndex].timestamp))) {
          placeholderData[placeholderIndex] = dataPoint;
        }
      }
    });
    
    // Sort by hour for proper display (0-23)
    placeholderData.sort((a, b) => a.hour - b.hour);
    
    return NextResponse.json({
      data: placeholderData,
      hours: hours,
      plantId: plantId || null,
      currentHour: currentHour
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics data' },
      { status: 500 }
    );
  }
}