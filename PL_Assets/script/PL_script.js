let userLat = 0;
let userLon = 0;
let numOfPosts = 0;

document.addEventListener('DOMContentLoaded', () => {
    const addressInput = document.getElementById('addressBox');
    addressInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            retrieveLatLon(addressInput.value);
        }
    });
});

// WORKFLOW: enter location OR retrieve location => API => Screen response => 
// enter number of locations => Haversine calculations => Sort by distance => formatted response

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read CSV file
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++

function parseCSV(callback) {
    let list = [];
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let csv = this.responseText;
            let lines = csv.split("\n");
            for (let i = 0; i < lines.length; i++) {
                let splitLine = lines[i].split(",");
                let item = {};
                item.parlerSourceFile = splitLine[0];
                item.parlerVideoDate = splitLine[1];
                item.parlerVideoTime = splitLine[2];
                item.parlerLat = parseFloat(splitLine[3]);
                item.parlerLon = parseFloat(splitLine[4]);
                item.videoDuration = splitLine[5];
                list.push(item);
            }
            callback(list);
        }
    };
    xhttp.open("GET", "PL_Assets/data/AllGeo-CLEANED.csv", true);
    xhttp.send();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get location from browser button, then format & feed to API for locationType and address look-up
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++

function getBrowserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showBrowserPosition);
    } else {
        x.innerText = "Geolocation doesn't seem to be supported by your browser.";
    }
}

function showBrowserPosition(position) {
    let address = position.coords.latitude + ", " + position.coords.longitude;
    retrieveLatLon(address);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Using GeoCode's API to either parse browser location, or user-entered location:
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++

function retrieveLatLon(address) {
    fetch(`https://geocode.maps.co/search?q=${address}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);

            let locationType = data[0].class;
            let apiParsedAddress = data[0].display_name;
            userLat = data[0].lat;
            userLon = data[0].lon;
            //  next adds line-breaks to seperate address based on ", " -- COMMENTED OUT FOR NOW
            //            apiParsedAddress = apiParsedAddress.replaceAll(', ', '<br>');

            document.getElementById("result").innerHTML =
                `<strong>This location seems to be near:</strong><br>The ${locationType} ${apiParsedAddress}.<br>
                <strong>This location is at </strong> Latitude: ${userLat}, Longitude: ${userLon}.<br>
                You can double check the accuracy <a href='https://maps.google.com/maps?q=${userLat},${userLon}' target='_blank'>HERE</a>.`;
            // You can double check the accuracy <a href='https://maps.google.com/maps?q=&layer=c&cbll=${userLat},${userLon}' target='_blank'>HERE</a>.`;


            if (userLat < 24.6 || userLat > 49.2 || userLon < -124.7 || userLon > -67.0) {
                document.getElementById("countryCheck").innerHTML =
                    `Hmmmmm...this may be outside of the contiguous US, but we'll see what we can do with it !!<br><br>`;
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Haversine -- FIXED!
// JavaScript doesn't do degrees, so rewrote using radians
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++

function haversineDist(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // using deg2rad converter below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    // Math.atan2() returns the angle in the plane (in radians) 
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in Kilometers
    return d;
}

// JavaScript doesn't do degrees unlike Java, so wrote 
// the following to convert to radians for JavaScript

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function search() {
    numOfPosts = document.getElementById('numOfPosts').value;
    parseCSV(function (list) {

        // TROUBLESHOOTING:
        // console.log(userLat + ", " + userLon + ", " + numOfPosts);

        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let distance = haversineDist(userLat, userLon, item.parlerLat, item.parlerLon);
            item.distance = distance;
            item.enteredUserLat = userLat;
            item.enteredUserLon = userLon;
        }

        list.sort(function (a, b) { return a.distance - b.distance });
        let output = "";
        for (let i = 0; i < numOfPosts; i++) {
            let item = list[i];
            output += "<strong>LOCATION</strong> #" + (i + 1) + ":<br>"
            output += "<strong>DISTANCE:</strong> " + (item.distance * .6213712).toFixed(2) + " miles (or " + item.distance.toFixed(2) + " km), <strong>LAT:</strong> " + item.parlerLat + ", <strong>LON:</strong> " + item.parlerLon + "<br>";
            output += "<strong>SOURCE FILE:</strong> " + item.parlerSourceFile + ", <strong>DATE/TIME CREATED:</strong> " + item.parlerVideoDate + " @ " + item.parlerVideoTime + ", <strong>SOURCE VIDEO DURATION:</strong> " + item.videoDuration + " seconds.<br>"

            output += "<a href='https://maps.google.com/maps?q=&layer=c&cbll=" + item.parlerLat + "," + item.parlerLon + "' target='_blank'>Street View (if available)</a>&emsp;"
            output += "<a href='https://maps.google.com/maps?q=" + item.parlerLat + "," + item.parlerLon + "' target='_blank'>Map of Post Location</a>&emsp;"
            output += "<a href='https://www.google.com/maps/dir/?api=1&origin=" + item.enteredUserLat + "," + item.enteredUserLon + "&destination=" + item.parlerLat + "," + item.parlerLon + "' target='_blank'>Directions to Location</a><br><br>"
        }
        // create element instead?

        document.getElementById("output").innerHTML = output;
    });
}