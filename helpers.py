import feedparser
import urllib.parse
import urllib.request
import xml.dom.minidom
from xml.etree import ElementTree as et
import requests


def fweather(geo):
    """Looks up weather for geo."""
    # create a temporary xml for weather forecast
    destination = 'temp.xml'
    # generate a link for forecast
    uac = 'HvG.ysI7av'
    url = "http://www.myweather2.com/developer/forecast.ashx?uac=HvG.ysI7av&query=" + geo + "&temp_unit=c&ws_unit=kph"
    # rez=requests.get('http://www.myweather2.com/developer/forecast.ashx', params={'uac':uac, 'query':geo, 'temp_unit':'c', 'ws_unit': 'kph'})
    # download forecast
    urllib.request.urlretrieve(url, destination)
    # parse forecast
    dom = xml.dom.minidom.parse(destination)
    dom.normalize()
    # get current temp, weather type, min\max temp and a link for forecast
    fweather.cache['wurl0'] = url
    temp = dom.getElementsByTagName("temp")[0]
    fweather.cache['temp'] = temp.childNodes[0].nodeValue
    maxtemp = dom.getElementsByTagName("day_max_temp")[0]
    fweather.cache['maxtemp'] = maxtemp.childNodes[0].nodeValue
    mintemp = dom.getElementsByTagName("night_min_temp")[0]
    fweather.cache['mintemp'] = mintemp.childNodes[0].nodeValue
    wtype = dom.getElementsByTagName("weather_text")[0]
    fweather.cache['wtype'] = wtype.childNodes[0].nodeValue
    fweather.cache['wurl1'] = 'https://www.wunderground.com/cgi-bin/findweather/getForecast?query=' + geo

    maxtemp1 = dom.getElementsByTagName("day_max_temp")[1]
    fweather.cache['maxtemp1'] = maxtemp1.childNodes[0].nodeValue
    mintemp1 = dom.getElementsByTagName("night_min_temp")[1]
    fweather.cache['mintemp1'] = mintemp1.childNodes[0].nodeValue
    wtype1 = dom.getElementsByTagName("weather_text")[1]
    # fweather.cache['wtype1'] = wtype1.childNodes[0].nodeValue

    # alternative - openweathermap
    latlng = geo.split(',')
    # generate a link for forecast
    owm_app_id = '84c885777ff53f03ad2e64b72a2c03f9'
    rez = requests.get('http://api.openweathermap.org/data/2.5/forecast',
                       params={'lat': latlng[0], 'lon': latlng[1], 'units': 'metric', 'appid': owm_app_id})
    # parse forecast
    data = rez.json()
    # find lowest and highest temp from 5day forecast
    wtype = []
    fweather.cache['wtype1'] = ''
    if(data):
        for i in data['list']:
            if (float(i['main']['temp_max']) > float(fweather.cache['maxtemp'])):
                fweather.cache['maxtemp'] = int(i['main']['temp_max'])
            if(float(i['main']['temp_min']) < float(fweather.cache['mintemp'])):
                fweather.cache['mintemp'] = int(i['main']['temp_min'])
            if(i['weather'][0]['main'] not in wtype):
                wtype.append(i['weather'][0]['main'])
        fweather.cache['wtype1'] = wtype
    return fweather.cache


# initialize not-realy-cache
fweather.cache = {'temp': 0, 'maxtemp': 0, 'mintemp': 0, 'wtype': "", 'wurl': "", 'maxtemp1': 0, 'mintemp1': 0, 'wtype1': ""}
