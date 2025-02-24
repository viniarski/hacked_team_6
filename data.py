# To expose your environment variables then run the script, run the following commands in the terminal
# export SUPABASE_URL=URLGOESHERE
# export SUPABASE_ANON_KEY=KEYGOESHERE
# python data.py

# for the collection of data with sensors, and adding that data to the database
import os
from supabase import create_client
from sense_hat import SenseHat
from time import sleep

sense = SenseHat()
sense.colour.gain = 16

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")

supabase = create_client(url, key)

# gather data every 60 seconds
while True:
    temperature = sense.get_temperature() 
    pressure = sense.get_pressure()
    humidity = sense.get_humidity()
    brightness = sense.colour.clear
    print(temperature)
    print(pressure)
    print(humidity)
    print(brightness)
    data = supabase.table("pi_data").insert({"temperature": temperature, "pressure":pressure, "humidity":humidity, "brightness":brightness}).execute()
    print("Added to db")
    sleep(60)


# example select for testing
#select = supabase.table("readings").select("*").execute()
