import React, { useState } from 'react';
import OneCountry from './OneCountry';

const ShowFilterdResults = ({filteredCountries, setCountry}) => {

    const handleButtonClick = (country) => {
        setCountry(country);
    }

    if(filteredCountries.length > 10) {
        return (
            <p>Too many matches, specify another filter</p>
        );
      } else if(filteredCountries.length === 1) {
        return (
            <OneCountry filteredCountries={filteredCountries} />
        )
      } else {
        return (
            filteredCountries.map(country => 
                <li key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => handleButtonClick(country.name.common)}>show</button>
                </li>
            )
        )
      }
};

export default ShowFilterdResults;