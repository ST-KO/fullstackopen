import React from 'react';

const OneCountry = ({filteredCountries}) => {
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
          </div> 
        )
      )
};

export default OneCountry;