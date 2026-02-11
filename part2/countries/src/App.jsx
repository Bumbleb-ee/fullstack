import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_WEATHER_KEY

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (city && api_key) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
          console.log('Error fetching weather:', error)
        })
    }
  }, [city])

  if (!weather || !api_key) return null

  return (
    <div>
      <h3>Weather in {city}</h3>
      <p>temperature {weather.main.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.name.common} width="150" />
      <Weather city={country.capital} />
    </div>
  )
}

const CountryList = ({ countries, showCountry }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />
  }

  return (
    <div>
      {countries.map(country => (
        <div key={country.name.official}>
          {country.name.common}
          <button onClick={() => showCountry(country.name.common)}>show</button>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const countriesToShow = search
    ? countries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))
    : []

  const showCountry = (name) => {
    setSearch(name)
  }

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>
      <CountryList countries={countriesToShow} showCountry={showCountry} />
    </div>
  )
}

export default App
