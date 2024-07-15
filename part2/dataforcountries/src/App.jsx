import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [country, setCountry] = useState('');
  const [result, setResult] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  console.log(filteredCountries);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setResult(response.data);
      })
  }, []);
  
  const handleOnChage = (e) => {
    e.preventDefault();
    setCountry(e.target.value);
  }

  const filterCountry = () => {

    if(country.length > 0) {
      setFilteredCountries(result.filter(result => 
        result.name.common.toLowerCase().includes(country.toLowerCase())));
    }
  }

  useEffect(() => {
    filterCountry();
  }, [country]);

  const ShowFilteredResult = () => {
    if(filteredCountries.length > 10) {
      return (<p>Too many matches, specify another filter</p>);
    } else if (filteredCountries.length === 1) {
      return (
        filteredCountries?.map(country =>
          <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <div>
              <b>languages:</b>
              <ul>
                {Object.keys(country.languages).map(lang => <li>{country.languages[lang]}</li>)}
              </ul>
            </div>
            <img src={country.flags.png} height='250' width='250' />
          </div> 
        )
      )
    } else {
      return (filteredCountries.map(country => <li>{country.name.common}</li>))
    }
  }
  
  return (
    <div>
      <form>
        find countries <input type="text" value={country} onChange={handleOnChage} />
      </form>
      <div>
        <ShowFilteredResult />
      </div>
    </div>
  );
};

export default App;