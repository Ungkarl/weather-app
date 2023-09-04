// services.js
export async function fetchGeoData(inputValue) {
    const geoApiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`;
    
    try {
      const geoResponse = await fetch(geoApiUrl);
      const geoData = await geoResponse.json();
      return geoData;
    } catch(error) {
      console.log("Error fetching geo data", error);
      throw error;
    }
  }
  
  export async function fetchLocationData(latitude, longitude) {
    const locationUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m&timezone&daily=temperature_2m_max&hourly=temperature_2m,precipitation_probability,cloudcover&timezone=Europe%2FBerlin`;
    
    try {
      const locationResponse = await fetch(locationUrl);
      const data = await locationResponse.json();
      return data;
    } catch(error) {
      console.log("Error fetching location data", error);
      throw error;
    }
  }


  export async function readUserLoc(latitude, longitude) {
    const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    
    try {
      const geoResponse = await fetch(geoApiUrl);
      const geoData = await geoResponse.json();
      return geoData;
    } catch(error) {
      console.log("Error fetching geo data", error);
      throw error;
    }
  }
  