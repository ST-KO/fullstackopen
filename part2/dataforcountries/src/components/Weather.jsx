import React from 'react';

const Weather = ({capital, weather}) => {
  return (
    <div>
        <h2>{`Weather in ${capital}`}</h2>
        <p>{`temperature ${(weather.main.temp - 273.5).toFixed(2)} Celcius`}</p>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" />
        <p>{`wind ${weather.wind.speed} m/s`}</p>
    </div>
  );
};

export default Weather;