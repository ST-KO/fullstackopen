import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShowFilterdResults from './components/ShowFilterdResults';

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

  const settingCountry = (country) => {
    setCountry(country);
  }
  
  return (
    <div>
      <form>
        find countries <input type="text" value={country} onChange={handleOnChage} />
      </form>
      <div>
        <ShowFilterdResults filteredCountries={filteredCountries} setCountry={settingCountry} />
      </div>
    </div>
  );
};

export default App;