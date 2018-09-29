// Google Map
var map;

//markers latlanf array
var markers = [];
// markers for map
var marks = [];
//routes on the map
var routes = [];
//weather data array
var weather = [];

//max and min temp on route
var temp_min = 40;
var temp_max = -40;
var result = '';
//itemd to check array
var items = [];
//checker if we have any items picked atm
var itempicked = null;

var countresult = '';
//what type of  trip we  selected/or not selected
var listactive = null;
//how many items are left to check
var listlength = 0;
//img 'checked'
var img = new Image();
img.src = '/static/check.png';
var itemspic = new Image();
//user img uploaded flag
var imguploaded = null;




// info window
var info = new google.maps.InfoWindow();

// execute when the DOM is fully loaded
$(function() {

    // styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    var styles = [];

    // options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var options = {

        center: {
            lat: 40,
            lng: 20
        }, //center of mediterean

        mapTypeId: 'hybrid',
        maxZoom: 20,
        panControl: true,
        styles: styles,
        zoom: 4,
        zoomControl: true
    };


    // get DOM node in which map will be instantiated
    var canvas = $("#map-canvas").get(0);

    // instantiate map
    map = new google.maps.Map(canvas, options);
    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
        if (markers.length > 1) {
            route = new google.maps.Polyline({
                path: [markers[markers.length - 1], markers[markers.length - 2]], //start and end of the route
                geodesic: true, //geodesic curve
                map: map //map to put route to

            });
            routes.push(route); //storing route in array
        }
    });
    // configure UI once Google Map is idle (i.e., loaded)
    google.maps.event.addListenerOnce(map, "idle", configure);
});

function placeMarkerAndPanTo(latLng, map) {
    var myLatLng = 'geo=' + latLng.lat().toFixed(2) + "," + latLng.lng().toFixed(2); //formaing latlng
    var content = "";
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        draggable: false
    });
  //  map.panTo(latLng);
    markers.push(latLng);
    marks.push(marker);
    //get forecast from http://www.myweather2.com/ and link to https://www.wunderground.com  and add it to content
    $.getJSON(Flask.url_for("weather"), myLatLng)
        .done(function(data, textStatus, jqXHR) {
            if (!(data)) {
                data['wtype'] = 'clear';
                data['temp'] = '10';
                data['mintemp'] = '10';
                data['maxtemp'] = '10';
                data['wtype1'] = 'clear';
            }

            content = content + "<a href=\"" + data['wurl1'] + "\" target=\"_blank\">";
            content = content + "   Weather: <b>" + data['wtype'] + "</b>;  Temp: <b>" + data['temp'] + "°C</b>; Night Min temp: <b>" + data['mintemp'] + "°C</b>; Day Max temp: <b>" + data['maxtemp'] + "°C</b>" + "</a>";
            weather.push(data);
        });

    marker.addListener('click', function() {
        showInfo(marker, content);
    });
}

// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < marks.length; i++) {
        marks[i].setMap(map);
    }
    for (var i = 0; i < routes.length; i++) {
        routes[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them. Also drops all canges for checklists
function deleteMarkers() {
    clearMarkers();
    marks = [];
    markers = [];
    weather = [];
    temp_min = 40;
    temp_max = -40;
    var countresult = '';
    for (var i = 0; i < routes.length; i++) {
        routes[i].setMap(null);
    }

    routes = [];
    $(".collapse").collapse('hide');
    iresult = "<lable id = 'manual' class = 'signupsubmit'>Select the type of adventure, upload photo of your equipment and check it on the following list:</label>";
    document.getElementById('list').innerHTML = iresult;
    document.getElementById('collapselist').style = 'height: 0px';
    document.getElementById('count').innerHTML = countresult;
    document.getElementById("error").innerHTML="";
    document.getElementById('temp').innerHTML = "";
    document.getElementById('itemspic').value='';
    imguploaded = null;
    itempicked = null;
    listactive = null;
    weather=[];
}

//after completing route weather is calculated and displayed, further options on adventure type are shown
function completeRoute() {

    result = '';
    var str_maxtemp = "";
    var str_mintemp = "";
    //calculating minimum and maximum temp for all points of route
    if (markers.length > 0) {

        for (i = 0; i < weather.length; i++) {
            if (temp_max < weather[i]['maxtemp1']) {
                temp_max = weather[i]['maxtemp1'];
            }
            if (temp_min > weather[i]['mintemp1']) {
                temp_min = weather[i]['mintemp1'];
            }
            if (temp_max < weather[i]['maxtemp']) {
                temp_max = weather[i]['maxtemp'];
            }
            if (temp_min > weather[i]['mintemp']) {
                temp_min = weather[i]['mintemp'];
            }
        }
         if(temp_max == -40)
    {
        result="<img src=\"/static/loader.gif\" height=\"40\">"+'<font size=\'3\' color=\"greenery\"> We are watching for signs and omens to figure weather forecast, pls try again!</font>\"<img src=\"/static/loader.gif\" height=\"40\"><br> ';
        result+='<input id = "ignore" onclick="ignoreweather();" value="ignore the weather" type="button" class="btn btn-glass btn-success">';
        document.getElementById('error').innerHTML = result;
        result='';
        return;
    }
    document.getElementById('error').innerHTML = "";
        if (temp_max > 0) {
            str_maxtemp = '<font size="5" color="red">+' + temp_max + '°C</font>';
        } else {
            str_maxtemp = '<font size="5" color="LightSkyBlue">' + temp_max + '°C</font>';
        }
        if (temp_min > 0) {
            str_mintemp = '<font size="5" color="red">+' + temp_min + '°C</font>';
        } else {
            str_mintemp = '<font size="5" color="LightSkyBlue">' + temp_min + '°C</font>';
        }
        result = '5 Days Minimal Night Temp: <b>' + str_mintemp + '</b> ' + " " + '5 Days Maximal Temp: <b>' + str_maxtemp + '</b>';
        result=result+'<br> Weather conditions: ';
        var obj = {};
        for (var i = 0; i < weather.length; i++) {
        var str = weather[i]['wtype1'] +" "+ weather[i]['wtype'];
        obj[str] = true;
        }
        result = result + '<b> <font size="5" color="Moccasin">' + Object.keys(obj) + '</b></font>';
          $(".collapse").collapse('show');
        document.getElementById('temp').innerHTML = result;
        document.getElementById("warning").style.visibility='visible';
        document.getElementById("pic").style.visibility='visible';

        if (listactive == null) { //if travel type is not yet selected - show image upload form

            var canvas = document.getElementById("pic"); //inialize canvas
            var context = canvas.getContext("2d");
            canvas.width = 320; // canvas size
            canvas.height = 320;
            context.fillStyle = "#222"; // fill color
            context.fillRect(0, 0, canvas.width, canvas.height); // paint canvas
        }
    }
}
function ignoreweather(){
     $(".collapse").collapse('show');
     document.getElementById("warning").innerHTML = "Make sure you're prepared for the bad weather conditions.";
     document.getElementById("error").innerHTML = "";

    if (listactive == null) { //if travel type is not yet selected - show image upload form

            var canvas = document.getElementById("pic"); //inialize canvas
            var context = canvas.getContext("2d");
            canvas.width = 320; // canvas size
            canvas.height = 320;
            context.fillStyle = "#222"; // fill color
            context.fillRect(0, 0, canvas.width, canvas.height); // paint canvas
        }
}
function buy()
{
     if (itempicked != null) {
         q=itempicked.innerText
         q=q.replace("(", "");
         q=q.replace(")", "");
         q=q.replace("/", "");
         q=q.replace(",", "");
         q1=q
         q=q.split(" ")
         if(q.length==1)
         {
         url='https://www.amazon.com/s/ref=nb_sb_noss_2/132-0405448-7550803?url=search-alias%3Daps&field-keywords='+q[0];
         }
         else if(q.length==2)
         {
         url='https://www.amazon.com/s/ref=nb_sb_noss_2/132-0405448-7550803?url=search-alias%3Daps&field-keywords='+q[0]+" "+q[1];
         }
         else if(q.length==3)
         {
         url='https://www.amazon.com/s/ref=nb_sb_noss_2/132-0405448-7550803?url=search-alias%3Daps&field-keywords='+q[0]+" "+q[1] +" "+ q[2];
         }
         else if(q.length==4)
         {
         url='https://www.amazon.com/s/ref=nb_sb_noss_2/132-0405448-7550803?url=search-alias%3Daps&field-keywords='+q[0]+" "+q[1] +" "+ q[2]+" "+ q[3];
         }
         else
         {
             url='https://www.google.com.ua/search?biw=1396&bih=668&q='+q1
         }
         window.open(url);
         itempicked=null;
     }
}
function uploadpic() {
    //initialize img and upload it
    var src = document.getElementById('itemspic').value.replace("http:", "");//allow to use http// and not get notifications about unsecure content
    itemspic.src = src;
    itemspic.onload = function() {
        imguploaded = 1;//mark that img is loaded and no need to paint canvas

        var canvas = document.getElementById("pic"); //inialize canvas
        var context = canvas.getContext("2d");
        context.drawImage(itemspic, 0, 0, 320, 320);// draw img on canvas
    };
    countresult = "<font size='3' color='mocassin'>Lets select type of advanture and check items</font>";
    document.getElementById('count').innerHTML = countresult;
    if (listactive == 0) { //if hike is already selected - rebuild canvas and list
        listactive = null;
        selecthike();
    }
    else if(listactive == 1) { //if kayak is already selected -  rebuild canvas and list
        listactive = null;
        selectkayak();
    }
    else if(listactive == 2) { //if alpinism is already selected -  rebuild canvas and list
        listactive = null;
        selectalpinism();
    }
    else if(listactive == 3) { //if biking is already selected - rebuild canvas and list
        listactive = null;
        selectbiking();
    }

}


//picking an item from the generated list, putting the mark on the  canvas.
function picker() {
    var canvas = document.getElementById("pic"); //inialize canvas
    var context = canvas.getContext("2d");
    if (imguploaded != 1) {
        context.fillStyle = "#222"; // fill color
        context.fillRect(0, 0, canvas.width, canvas.height); // paint canvas
    } else {
        var canvas = document.getElementById("pic"); //inialize canvas
        var context = canvas.getContext("2d");
        context.drawImage(itemspic, 0, 0, 320, 320);
    }
    canvas.onclick = function(e) {
        if (itempicked != null) { // click handler
            var rect = canvas.getBoundingClientRect(); //calculate x and y of click
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            context.drawImage(img, x - 5, y - 15); // draw an "check" icon on locaion
            itempicked.parentNode.removeChild(itempicked); //remove item from list
            itempicked = null; //selected ited flag
            listlength = listlength - 1; //shorten list
            if (listlength > 0) { //edit list length text
                countresult = " <font size='3' color='white'>Checklist has " + "<font size='3' color='mocassin'>" + listlength + "</font> items. Go and verify them!</font>";
            } else {
                countresult = "<font size='3' color='mocassin'>All items are checked!</font>";
            }
            document.getElementById('count').innerHTML = countresult;
        } else {
            alert('pick an item!'); //if no items picked - no icon will be placed
        }
    };
}

function selecthike() { //hike selection handler. kayak, alp and bike selection handlers are prety simmilar
    if (listactive == 0) { //if hike is already selected - do not rebuild canvas and list
        return;
    }

    picker(); // initialize canvas
    listactive = 0;// mark trveltype selected
    itempicked = null;//clear picked items
    $(".collapselist").collapse('show');
    iresult = '';
    var parameters = 'q=Camping'; //equire list of items
    if (temp_min < 0) { // check for lowest temp: if less than 0 celsium - include warm clothes tag
        parameters = parameters + '&t=1';
    }
    document.getElementById('list').style = "overflow-y: auto; height:360px;"; //build list
    $.getJSON(Flask.url_for("equip"), parameters)
        .done(function(data, textStatus, jqXHR) {
            for (i = 0; i < data.length; i++) {
                //generate a buttot for each list element
                iresult = iresult + '<button onclick=\"hideElement(this);\" style=\"height:60px;width:340px;white-space: pre-line;font-size: 20px;background: rgba(0, 0, 0, 0.5);color: #a5c75f;border-radius: 7px;border: dotted #1f628d 1.5px;\">' + data[i].name + '</button>';
                items.push(data[i].name);
            }
            listlength = data.length; //number of the items to display
            countresult = " <font size='3' color='white'>Checklist has " + listlength + " items. Go and verify them!</font>";
            document.getElementById('count').innerHTML = countresult; //show items quantity
            document.getElementById('list').innerHTML = iresult; //show buttons

        });
}

function selectkayak() {
    if (listactive == 1) {
        return;
    }
    picker();
    listactive = 1;
    itempicked = null;
    $(".collapselist").collapse('show');
    iresult = '';
    var parameters = 'q=Kayaking';
    if (temp_min < 0) {
        parameters = parameters + '&t=1';
    }
    document.getElementById('list').style = "overflow-y: auto; height:360px;";
    $.getJSON(Flask.url_for("equip"), parameters)
        .done(function(data, textStatus, jqXHR) {
            for (i = 0; i < data.length; i++) {
                iresult = iresult + '<button onclick=\"hideElement(this);\" style=\"height:60px;width:340px;white-space: pre-line;font-size: 20px;background: rgba(0, 0, 0, 0.5);color: #a5c75f;border-radius: 7px;border: dotted #1f628d 1.5px;\">' + data[i].name + '</button>';
                items.push(data[i].name);
            }
            document.getElementById('list').innerHTML = iresult;
            listlength = data.length;
            countresult = " <font size='3' color='white'>Checklist has " + listlength + " items. Go and verify them!</font>";
            document.getElementById('count').innerHTML = countresult;
        });


}

function selectalpinism() {
    if (listactive == 2) {
        return;
    }
    picker();
    listactive = 2;
    itempicked = null;
    $(".collapselist").collapse('show');
    iresult = '';
    var parameters = 'q=Alpinism';
    if (temp_min < 0) {
        parameters = parameters + '&t=1';
    }
    document.getElementById('list').style = "overflow-y: auto; height:360px;";
    $.getJSON(Flask.url_for("equip"), parameters)
        .done(function(data, textStatus, jqXHR) {

            for (i = 0; i < data.length; i++) {
                iresult = iresult + '<button onclick=\"hideElement(this);\" style=\"height:60px;width:340px;white-space: pre-line;font-size: 20px;background: rgba(0, 0, 0, 0.5);color: #a5c75f;border-radius: 7px;border: dotted #1f628d 1.5px;\" id = \'' +data[i].name + '\'>' + data[i].name + '</button>';
                items.push(data[i].name);
            }
            document.getElementById('list').innerHTML = iresult;
            listlength = data.length;
            countresult = " <font size='3' color='white'>Checklist has " + listlength + " items. Go and verify them!</font>";
            document.getElementById('count').innerHTML = countresult;
        });

}

function selectbiking() {
    if (listactive == 3) {
        return;
    }
    picker();
    listactive = 3;
    itempicked = null;
    $(".collapselist").collapse('show');
    iresult = '';
    var parameters = 'q=Biking';
    if (temp_min < 0) {
        parameters = parameters + '&t=1';
    }
    document.getElementById('list').style = "overflow-y: auto; height:360px;";
    $.getJSON(Flask.url_for("equip"), parameters)
        .done(function(data, textStatus, jqXHR) {

            for (i = 0; i < data.length; i++) {
                iresult = iresult + '<button onclick=\"hideElement(this);\" style=\"height:60px;width:340px;white-space: pre-line;font-size: 20px;background: rgba(0, 0, 0, 0.5);color: #a5c75f;border-radius: 7px;border: dotted #1f628d 1.5px;\">' + data[i].name + '</button>';
                items.push(data[i].name);
            }
            document.getElementById('list').innerHTML = iresult;
            listlength = data.length;
            countresult = " <font size='3' color='white'>Checklist has " + listlength + " items. Go and verify them!</font>";

            document.getElementById('count').innerHTML = countresult;
        });

}

function hideElement(obj) {
    itempicked = obj; //check if we can remove this item from list
}

function configure() {
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
        // if info window isn't open
        // http://stackoverflow.com/a/12410385
    });
}

function showInfo(marker, content) {
    // start div
    var div = "<div id='info'>";
    if (typeof(content) == "undefined") {
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='/static/ajax-loader.gif'/>";
    } else {
        div += content;
    }
    // end div
    div += "</div>";
    // set info window's content
    info.setContent(div);
    // open info window (if not already open)
    info.open(map, marker);
}
