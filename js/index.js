
//-------------------IMPORT AF FUNKTIONER OG MODULER-------------------//
import { fetchGeoData, fetchLocationData, readUserLoc } from './services.js';
import {weatherInfoTmpl, imgTmpl} from './templates.js'



//----------------------------DOM ELEMENTER----------------------------//
const fetchButton = document.querySelector('.fetch-button');
const inputElement = document.querySelector('.testing');


//------------------------GEOLOKATION INDLÆSNING-----------------------//
if (navigator.geolocation) {
  // Browseren har understøttelse for Geolocation API
  navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
  // Browseren understøtter ikke Geolocation API
  console.log("Geolocation er ikke understøttet af denne browser");
}



//-------------------------GEOLOKATION SUCCESS-------------------------//
function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  
  console.log("Breddegrad: " + latitude + ", Længdegrad: " + longitude);
  
  fetchData(latitude, longitude);
}


//--------------------------GEOLOKATION ERROR--------------------------//
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("Brugeren nægtede adgang til lokation");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Lokationsdata er ikke tilgængelig");
      break;
    case error.TIMEOUT:
      console.log("Tidsgrænse overskredet for at hente lokationsdata");
      break;
    case error.UNKNOWN_ERROR:
      console.log("En ukendt fejl opstod");
      break;
  }
}


//---------------------EVENT LISTENER, INPUT & ENTER-------------------//
inputElement.addEventListener('keydown', async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    await fetchData();
  }
});

fetchButton.addEventListener('click', async () => {
  await fetchData();
});


//--------------FUNKTIONER FOR HENTNING & VISNING AF DATA--------------//
async function fetchData(latitude, longitude) {
  const inputValue = inputElement.value; //Henter det indskrevne fra brugeren (by)

  try {
    //Hvis der er coordinater fra brugeren
    if (latitude > 0) {
      
      //Services function med koordinater
      const userData = await readUserLoc(latitude, longitude) 

       //Får navnet på byen udfra koordinater
      const geoData = await fetchGeoData(userData.address.town); 

      //Logging
      

      //Hvis modtagne længde er mere end 0
      if (geoData.length > 0) {
        //Tag første lokation i array'et.
        const firstLocation = geoData[0];

        //Henter displayname
        const displayName = firstLocation.display_name;

        // Del displaynavnet og tag det første element
        const cityName = displayName.split(",")[0];

        //splitter hele displaynavnet
        const country = displayName.split(",");

        //Får fat i længden på hele displayname, hvor den anden sidste altid vil være bynavnet.
        const countrySplit = country[country.length - 1];

        //Logging
        console.log(countrySplit);

        //Henter latitude & longitude
        const latitude = firstLocation.lat;
        const longitude = firstLocation.lon;

        //Api som tager koordinater og giver mig lokationnavnet
        const data = await fetchLocationData(latitude, longitude);
        const cloudcover = data.hourly.cloudcover[0];
        //Nuværende vejr fra api
        const currentWeather = data.current_weather;

        //Nuværende temperatur fra api
        const temperature = currentWeather.temperature;

        //Nedbør i %
        const precipitation = data.hourly.precipitation_probability[0];

        //logging
        console.log(data);

        console.log('Temperatur:', temperature, 'Nedbør:', precipitation, 'Skydække:', cloudcover);

        const weatherInfoHTML = weatherInfoTmpl({
          //Opretter mit HTML fra skabelon
          displayName: cityName,
          temperature: temperature,
          precipitation: precipitation,
          cloudcover: cloudcover,
          country: countrySplit,
        });

        // Definer konstanter for billedstier
        const weatherConditions = [
          { condition: "clear", image: "assets/day_clear.png" },
          { condition: "cloudy", image: "assets/cloudy.png" },
          { condition: "partial_cloud", image: "assets/day_partial_cloud.png" },
          { condition: "rain", image: "assets/day_rain.png" },
          { condition: "cloudy&rain", image: "assets/rain.png" },
        ];

        // Find den relevante vejrtilstand baseret på skydækkeprocenten og regnprocenten
        let selectedCondition = "clear";
        if (cloudcover > 60 && precipitation > 45) {
          selectedCondition = "cloudy&rain";
        } else if (cloudcover > 60) {
          selectedCondition = "cloudy";
        } else if (cloudcover > 20) {
          selectedCondition = "partial_cloud";
        } else if (precipitation >= 50) {
          selectedCondition = "rain";
        }

        // Find billedstien, der matcher den valgte tilstand
        const selectedImage = weatherConditions.find(
          (condition) => condition.condition === selectedCondition
        ).image;

        // Opret HTML fra skabelon
        const imgStatusHTML = imgTmpl({
          status: selectedImage,
        });

        // Opdater billedcontaineren med HTML
        const imgStatusContainer = document.querySelector(".img-status");
        imgStatusContainer.innerHTML = imgStatusHTML;

        const currentWeatherContainer = document.querySelector(".info");
        currentWeatherContainer.innerHTML = weatherInfoHTML; //Udskriver
      }

    }
    const geoData = await fetchGeoData(inputValue); //Fetcher en API, fra services med den indtastede by/land, som så giver mit koordinater.

    if (geoData.length > 0) { //Hvis modtagne længde er mere end 0
      
      //Tag første lokation i array'et.
      const firstLocation = geoData[0]; 

      //Henter displayname
      const displayName = firstLocation.display_name; 

      // Del displaynavnet og tag det første element
      const cityName = displayName.split(',')[0]; 

      //splitter hele displaynavnet
      const country = displayName.split(',')

      //Får fat i længden på hele displayname, hvor den anden sidste altid vil være bynavnet.
      const countrySplit = country[country.length -1]
      
      //Logging
      console.log(countrySplit) 
      
      //Henter latitude & longitude
      const latitude = firstLocation.lat; 
      const longitude = firstLocation.lon; 


      //Api som tager koordinater og giver mig lokationnavnet
      const data = await fetchLocationData(latitude, longitude); 
      const cloudcover = data.hourly.cloudcover[0];
      //Nuværende vejr fra api
      const currentWeather = data.current_weather; 

      //Nuværende temperatur fra api
      const temperature = currentWeather.temperature; 

      //Nedbør i %
      const precipitation = data.hourly.precipitation_probability[0]; 

      //logging
      console.log(data)
      
      
    

      
      const weatherInfoHTML = weatherInfoTmpl({ //Opretter mit HTML fra skabelon
        displayName: cityName,
        temperature: temperature,
        precipitation: precipitation,
        cloudcover: cloudcover,
        country: countrySplit
      });


      // Definer konstanter for billedstier
      const weatherConditions = [
        { condition: 'clear', image: 'assets/day_clear.png' },
        { condition: 'cloudy', image: 'assets/cloudy.png' },
        { condition: 'partial_cloud', image: 'assets/day_partial_cloud.png' },
        { condition: 'rain', image: 'assets/day_rain.png' },
        { condition: 'cloudy&rain', image: 'assets/rain.png' },
        { condition: 'day_snow', image: 'assets/day_snow.png' },
        { condition: 'night_moon', image: 'assets/night_full_moon_clear.png' },
        { condition: 'night_moon_partial_cloud', image: 'assets/night_moon_partial_cloud.png' },
        { condition: 'night_moon_rain', image: 'assets/night_moon_rain.png' }
      ];

      // Finder min vejrtilstand
      let selectedCondition = "clear";
      if (cloudcover > 60 && precipitation > 45) {
        selectedCondition = "cloudy&rain";
      } else if (cloudcover > 60) {
        selectedCondition = "cloudy";
      } else if (cloudcover > 20) {
        selectedCondition = "partial_cloud";
      } else if (precipitation >= 50) {
        selectedCondition = "rain";
      }
      

      // Finder billedstien, der matcher den valgte tilstand
      const selectedImage = weatherConditions.find(
        (condition) => condition.condition === selectedCondition
      ).image;

      // Opret HTML fra skabelon
      const imgStatusHTML = imgTmpl({
        status: selectedImage,
      });

      // Opdater billedcontaineren med HTML
      const imgStatusContainer = document.querySelector(".img-status");
      imgStatusContainer.innerHTML = imgStatusHTML;


      const currentWeatherContainer = document.querySelector('.info');
      currentWeatherContainer.innerHTML = weatherInfoHTML; //Udskriver
    }
  } catch (error) {
    console.log("Error fetching data", error);
  }
}






//--------------FUNKTIONER TIL BILLEDE-STATUS--------------//

