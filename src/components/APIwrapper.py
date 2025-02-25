#==============================================================================
# PLEASE BE AWARE
# The API endpoint requires an ID that is unique to every plant.
# You can NOT use the name of the plant to get information.
# To get IDs, you need to use the search by category which returns information
# about every plant in that category, including a name.
#==============================================================================


import requests

# API Key
TOKEN = "zsaV2nCM8NI5hWTctLnI88Ih4KrZjnKL0dmsYpfZvP8"


# Pass in an ID as a string.
# Returns an array in the format [minTemp, maxTemp, minLight, maxLight, watering]
def FindFromID(id):

    # Form the api request
    headers = {"Authorization": "Bearer 6963|BbeMn037WJ8vTWKZs6MmI7C0Gwyj9xbEq1xUcCC0"}#
    url = f"https://zylalabs.com/api/774/house+plants+database+api/510/get+plant+by+id?plant_id={id}"

    # Create the api request
    data = requests.get(url, headers=headers)
    result = data.json()

    minLight = 0
    maxLight = 0

    watering = result['Watering']

    if "+" in result["Light ideal"]:
        # Pull the light levels from the string
        splitLightDisplay = result["Light ideal"].split(" (")[1].split("/")[0].replace(" ", "").replace("lux", "").replace(",","")
        minLight = splitLightDisplay
        maxLight = "Infinity"
    else:
        splitLightDisplay = result["Light ideal"].replace(" lux", "").replace(",","").split(" ( ")[1].split("/")[0].split(" to ")
        minLight = int(splitLightDisplay[1])
        maxLight = int(splitLightDisplay[0])


    temperatureMin = result["Temperature min"]
    if (temperatureMin != None):
        temperatureMin = temperatureMin["C"]
    else:
        temperatureMin = -273

    temperatureMax = result["Temperature max"]
    if (temperatureMax != None):
        temperatureMax = temperatureMax["C"]
    else:
        temperatureMax = 999

    expected = [temperatureMin,temperatureMax, minLight,maxLight, watering]
    print(expected)
    return expected



# Pass in a string for searchTerm out of the list of valid categories.
# Returns an array of IDs that are in that category.
def SearchForIDs(searchTerm):

    # Form the api request
    headers = {"Authorization": "Bearer 6963|BbeMn037WJ8vTWKZs6MmI7C0Gwyj9xbEq1xUcCC0"}#
    url = f"https://zylalabs.com/api/774/house+plants+database+api/509/search?query={searchTerm}"

    # Create the api request
    data = requests.get(url, headers=headers)
    result = data.json()

    # Iterate through each result and remove duplicates
    toReturn = []
    for element in result:

        toReturn.append(element["item"]["id"])
    
    return toReturn

