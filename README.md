<h1 align="center">
<br>
<a href="https://github.com/StephenChalmers/rentroost"><img src="https://stephenchalmers.github.io/ParLoc/PL_Assets/images/PL_Logo-640px.png" alt="Parlor Locator" width="200"></a>
<br><br>Parler Locator</h1>
<p align="center">
<a href="#background">Background</a> •
<a href="#coding-and-data">Coding, Data and Such</a> •
<a href="#note">Note</a>
</p>
    
## Background
In February 2023, I became interested in the rise and fall of Parler (and analysis of its data) after being asked to write the chapter “Selfies, Biometrics, Geolocation, and the 2021 Capitol Hill Riot: How Photography is Used in the Service of Surveillance” for the book <a href="https://www.routledge.com/The-Routledge-Companion-to-Photography-Representation-and-Social-Justice/Neumuller/p/book/9781032112947" target="_blank"><em>The Routledge Companion to Photography, Representation and Social Justice</em></a> (Taylor &amp; Francis, ISBN: 978-1-032-11294-7). Among other topics in this chapter, I discussed how facial recognition was used to identify suspected participants of the Capitol Hill riot, from videos scraped from Parler.
<h5 align="center">
<img src="https://stephenchalmers.github.io/ParLoc/PL_Assets/images/ParLoc_Posts-small_1280px.png" width="600" align="center" alt="Map of geotagged posts"><br> A GIS map I generated to show the distribution of the 64,520 posts in the cleaned dataset</h5>


The social media site '<a href="https://en.wikipedia.org/wiki/Parler/">Parler</a>,' was launched on 08 August 2018 by John Matze and Jared Thomson. Associated with extreme conservatives, the platform marketed itself as a “free speech” alternative (meaning fewer content policies) to other networks such as Twitter and Facebook.


During 2020, Parler experienced a significant surge in popularity during the lead-up to the U.S. presidential election. Many users flocked to the platform, believing it provided a platform for unfettered conservative political discourse - while others viewed the network as amplifying extremist, racist, sexist and violent content, along with conspiracy theories. 

Following the storming of the U.S. Capitol on 6 January 2021, Parler faced increased scrutiny due to its role in facilitating the planning and organization of the insurrection. The application was removed from Apple's App Store and Google Play, and on 10 January 2021 Amazon Web Services (AWS) terminated Parler's hosting services, after finding the company in breach of contract for failing to identify and remove posts by users that called for the “rape, torture, and assassination” of elected officials, police officers, and public-school teachers - removing the hosting effectively took the platform offline.


<h5 align="center">
<img src="https://stephenchalmers.github.io/ParLoc/PL_Assets/images/donk_enby copy.jpg" width="150" align="center" alt="Donk Enby, with Gurken Prinz pickles"><br> @donk_enby (Credit: Twitter)</h5>


Prior to deplatforming, a user named '@donk_enby' used a Python script to copy ~8TB, or ~99% of the publicly available data uploaded to the platform, due to the platform's poor coding and lax security (including sequentially numbered posts, and no rate limiting of downloads).
<br>

Of the 1.1 million videos in the downloaded tranche, geolocation data was present in about 6%. This web-based application searches through those 64,520 (after I cleaned the data) geotagged video posts for those closest to your entered location. 
<br>

Of the geotagged videos, <a href="https://backspace.com/parler-capitol/" target="_blank">618 were directly linked to the storming of the U.S. Capitol</a> - which federal prosecutors <a href="https://www.reuters.com/article/us-usa-trump-capitol-arrests/u-s-says-capitol-rioters-meant-to-capture-and-assassinate-officials-filing-idUSKBN29K0K7?il=0" class="links" target="_blank">stated</a> involved a plot “to capture and assassinate elected officials.” These 618 geotagged and other (non-geotagged) videos from that day were used in the second impeachment of Donald Trump, as well as the arrests/convictions of many of the other <a href="https://www.justice.gov/usao-dc/capitol-breach-cases" target="_blank">participants to the Capitol Hill riot</a>.
<br><br>

## Coding and Data          
The dataset contains longitude and latitude to four decimal places - meaning it can be assumed to have an accuracy of approximately +/- 36 feet (11 meters) in North America. Other than the location, date and post number, other identifiable information (such as user name) was stripped out of the dataset.</p>
If you enter a location on the following page, it is forward geocoded - and if you use the browser location query it is reverse geocoded to the Map Maker <a href="https://geocode.maps.co/" target="_blank">Geocoding API</a>. The Java backend calculates distances using the <a href="https://en.wikipedia.org/wiki/Haversine_formula" target="_blank">Haversine Formula</a> - a trigometric approach dating to the very start of the 19th century. The Haversine formula determines the great-circle distances between points on a sphere* given their longitudes and latitudes.
<br><br>
After calculating the distance between your (entered or queried) latitude/longitude and each of the 64,520 posts, the results are sorted and you are provided the number of posts requested in order of proximity, along with formatted links to Google Maps, Google Street View, and Google Directions from your location to the location associated with the Parler post. Originally conceived as a fully Google Maps API project, it was changed to the free Map Maker API to eliminate cost (with the assumption I would post it for public use). Note that the chosen API is rate limited to two requests per second, so if this application exceeds that, you may receive a <a href="https://httpstatusdogs.com/429-too-many-requests" target="_blank">HTTP 429</a> response.
<br>          
* Even ignoring surface topography, Earth isn't a sphere (it is more of an ellipsoid/squished spheroid shape), but the Haversine is a fairly simple formula that is also very accurate with close points (just less so with greater distances).
<br><br>

## Note
The locations on the following page may not correlate with anyone who participated in the activities in DC on 1/6/2021, and may just indicate a random user of the platform driving by a given location, inaccurate geotagging by the mobile device, inaccurate parsing of the coordinates by the API or Google, or any number of other possibilities.
<br>

<strong>THIS SHOULD BE VIEWED MERELY AS A PROGRAMMING / MAPPING EXERCISE.</strong>
     
<br>
© 2023, <a href="www.stephenchalmers.com">Stephen Chalmers</a>
