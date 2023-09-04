export const weatherInfoTmpl = (data) => `
                
                    <h1 class="city-name">${data.displayName}, ${data.country}</h1>
                    <p class="chance-rain">Regn: ${data.precipitation}%</p>
                    <p class="cloud-cover">Skydække ${data.cloudcover}%</p>
                    <p class="degrees">${data.temperature}°</p>
                
`

export const imgTmpl = (img) => `
<img src="${img.status}" alt="">
` 