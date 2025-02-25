// API Key
const TOKEN = "zsaV2nCM8NI5hWTctLnI88Ih4KrZjnKL0dmsYpfZvP8";

// Pass in an ID as a string.
// Returns an array in the format [minTemp, maxTemp, minLight, maxLight, watering]
async function FindFromID(id) {

    // Form the API request
    const headers = {
        "Authorization": "Bearer 6963|BbeMn037WJ8vTWKZs6MmI7C0Gwyj9xbEq1xUcCC0"
    };
    const url = `https://zylalabs.com/api/774/house+plants+database+api/510/get+plant+by+id?plant_id=${id}`;

    // Create the API request
    const response = await fetch(url, { headers });
    const result = await response.json();

    let minLight = 0;
    let maxLight = 0;

    const watering = result['Watering'];

    if (result["Light ideal"] && result["Light ideal"]?.includes("+")) {
        // Pull the light levels from the string
        const splitLightDisplay = result["Light ideal"]
            
            .replace(" ", "")
            .replace("lux", "")
            .replace(",", "")
            .split(" (")[1]
            .split("/")[0];
        minLight = splitLightDisplay;
        maxLight = "Infinity";
    } else if(result["Light ideal"]) {
        const splitLightDisplay = result["Light ideal"]
            .replace(" lux", "")
            .replace(",", "")
            .split(" ( ")[1]
            .split("/")[0]
            .split(" to ");
        minLight = parseInt(splitLightDisplay[1]);
        maxLight = parseInt(splitLightDisplay[0]);
    }

    let temperatureMin = result["Temperature min"];
    if (temperatureMin !== null && temperatureMin["C"]) {
        temperatureMin = temperatureMin["C"];
    } else {
        temperatureMin = -273;
    }

    let temperatureMax = result["Temperature max"];
    if (temperatureMax !== null&& temperatureMin["C"]) {
        temperatureMax = temperatureMax["C"];
    } else {
        temperatureMax = 999;
    }

    const expected = [temperatureMin, temperatureMax, minLight, maxLight, watering];
    console.log(expected);
    return expected;
}

// Pass in a string for searchTerm out of the list of valid categories.
// Returns an array of IDs that are in that category.
async function SearchForIDs(searchTerm) {

    // Form the API request
    const headers = {
        "Authorization": "Bearer 6963|BbeMn037WJ8vTWKZs6MmI7C0Gwyj9xbEq1xUcCC0"
    };
    const url = `https://zylalabs.com/api/774/house+ plants+database+api/509/search?query=${searchTerm}`;

    // Create the API request
    const response = await fetch(url, { headers });
    const result = await response.json();

    // Iterate through each result and return IDs
    const toReturn = result.map(element => element.item.id);

    return toReturn;
}

// Function to input search term, get IDs, and then fetch details for each ID
async function searchAndFetchDetails(searchTerm) {
    // Get the IDs based on the search term
    const ids = await SearchForIDs(searchTerm);

    // If there are IDs, fetch details for each
    if (ids.length > 0) {
        console.log(`Found ${ids.length} plant(s) for the search term "${searchTerm}"`);

        // Loop through each ID and call FindFromID
        for (const id of ids) {
            console.log(`Fetching details for ID: ${id}`);
            const expectedValues = await FindFromID(id);
            console.log(`Expected values for ID ${id}:`, expectedValues);
        }
    } else {
        console.log("No plants found for the search term:", searchTerm);
    }
}

// Example: Search for "succulent" and get details
searchAndFetchDetails("fern");
