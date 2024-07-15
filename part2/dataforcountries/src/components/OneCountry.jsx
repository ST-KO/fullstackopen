import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Weather from './Weather';

const OneCountry = ({filteredCountries}) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const [weather, setWeather] = useState(null);
    const capital = filteredCountries.map(country => country.capital);

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${API_KEY}`)
            .then(response => {
                console.log(response.data);
                setWeather(response.data);
            })
    }, []);

    return (
        filteredCountries?.map(country =>
          <div key={country.name.common}>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <div>
              <b>languages:</b>
              <ul>
                {Object.keys(country.languages).map(lang => <li key={country.languages[lang]}>{country.languages[lang]}</li>)}
              </ul>
            </div>
            <img src={country.flags.png} height='250' width='250' />
            {
                weather &&
                <Weather capital={country.capital} weather={weather} />
            }
          </div> 
        )
      )
};

export default OneCountry;