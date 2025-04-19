from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime, timedelta, timezone

app = Flask(__name__)

API_KEY = 'c6f9e7d274a4a346543734f9212e7d8d'

def get_weather_data(city):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url)
    forecast_response = requests.get(forecast_url)

    weather = None
    forecast = None

    if response.status_code == 200:
        data = response.json()
        description = data['weather'][0]['description']
        timezone_offset = data.get('timezone', 0)

        utc_now = datetime.now(timezone.utc)
        city_time = utc_now + timedelta(seconds=timezone_offset)
        city_time_str = city_time.strftime("%Y-%m-%d %H:%M:%S")

        if "rain" in description:
            bg_image = "rainy.jpeg"
        elif "cloud" in description:
            bg_image = "clouds.jpeg"
        elif "snow" in description:
            bg_image = "snow.jpeg"
        elif "clear" in description:
            bg_image = "clear.jpeg"
        else:
            bg_image = "default.jpeg"

        weather = {
            'city': data['name'],
            'temperature': data['main']['temp'],
            'description': description,
            'icon': data['weather'][0]['icon'],
            'bg_image': bg_image,
            'local_time': city_time_str
        }
    else:
        weather = {'error': 'City not found!'}

    if forecast_response.status_code == 200:
        forecast_data = forecast_response.json()
        forecast = []

        for item in forecast_data['list']:
            if "12:00:00" in item['dt_txt']:
                day_forecast = {
                    'date': item['dt_txt'].split(' ')[0],
                    'temp': item['main']['temp'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                }
                forecast.append(day_forecast)

    return weather, forecast

@app.route('/', methods=['GET', 'POST'])
def index():
    weather = None
    forecast = None

    if request.method == 'POST':
        city = request.form.get('city')
        if city:
            weather, forecast = get_weather_data(city)

    return render_template('index.html', weather=weather, forecast=forecast)

@app.route('/location', methods=['POST'])
def get_location():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')

    if lat and lon:
        url = f"http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={API_KEY}"
        response = requests.get(url)

        if response.status_code == 200:
            result = response.json()
            if result:
                city = result[0]['name']
                return jsonify({'city': city})

    return jsonify({'city': None})

if __name__ == '__main__':
    app.run(debug=True)
