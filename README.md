# Skliarov Anton
This is my CS50 Final Project.
Youtube video is here https://www.youtube.com/watch?v=5_HvPkMt4Ck
Subtitles and description are available in English, Russian and Ukrainian.

The base of my project is weather forecasts, google map, canvas drawing and database.
I added 3 weather forecast api's to secure that if one forecast-provider goes offline, weather information will still be available.
They are
    - myweather2
    - wunderground
    - openweathermap
If all of them are offline - app will advice user to be ready to any weather conditions.
BUT weather forecast providers myweather2 and openweathermap.org are changing their APIs time after time and this causes errors while app
is trying to parce results of request. Also sometimes they are slow on response and free account has no priveleges, so weather info
downloads not so fast. It is better tо klick "Complete route" button for 1-2 times.
To test weather forecast info for specified location go to
http://ide50-antonskl.cs50.io:8080/weather?geo=48.88,27.50
where geo = lat. and long. coordinates of place on map. wurl0, wurl1 are links for API provider sites with request.

To see formed list of items go to
http://ide50-antonskl.cs50.io:8080/equip?q=Alpinism
where q = type of travel: Alpinism, Biking, Camping, Kayaking.



This is my first own project, so it has a lot of dirrections for improoving:

    - More personalisation: authorisation and personal items lists can be added, Sharing lists via social medias;
    - Items lists for grous (for example 1 tent, kitchen set and axe for 3 travelers), assigning group equipment to group members
      basing on weight/volume
    - More advanture types, such as Trail Run, Hitchhiking, Beach resort trip etc.;
    - Free weather forecast apis allow short-term weather info, 5+ days forecasts are available only for paid accounts;
    - Export\import of tracks from popular formats
    - Daily tipps; useful articles or news on travelling thematics
    - much more =)


My python\js\html\css web based app for hikers and travelers.
Based on pset8 and some backpack packing experience =)

The user builds the route of his\her planned adventure, checks the weather forecast for each point of the route and total weather
conditions - max day and min night temperatures, weather conditions.
The track can be hidden or cleared. Then the type of the planned adventure is selected: hiking, kayaking, alpinism, and biking,
a photo of 'to-take' equipment is uploaded and is checked it according to a list.
The List is formed by my app from outdoor equipment database, analyzing the weather conditions and the adventure type.
To check an item from the list it must be clicked and then the mark on the picture of equipment must be placed. After confirming
the item is disappeared from the list. If you just don't have an item - you can buy it in the Amazon store or google it!
Items left on the list are forgotten or not needed from user's experience.
