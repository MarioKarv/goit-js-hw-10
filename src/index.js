import './css/styles.css';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputData, DEBOUNCE_DELAY));


function onInputData(e) {
  let inputNameCountry = e.target.value.trim();
  if (inputNameCountry) {
    return fetchCountries(inputNameCountry)
      .then(data => {
        chooseProcess(data);
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}


function chooseProcess(countryFromBack) {
  if (countryFromBack.length === 1) {
    countryList.innerHTML = '';
    return finalCountryInfo(countryFromBack);
  }

  if (countryFromBack.length >= 2 && countryFromBack.length <= 10) {
    countryInfo.innerHTML = '';
    return findProcessCountry(countryFromBack);
  }

  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function findProcessCountry(data) {
  const markup = data
    .map(element => {
      return `<li class="country-item">
            <img src="${element.flags.svg}" alt="${element.name.official}" width="40" height="20" /> 
            <p>${element.name.official}</p>
            </li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}

function finalCountryInfo(data) {
  const markup = data
    .map(element => {
      return `<h1>
       <img src="${element.flags.svg}" alt="${
        element.name.official
      }" width="40" height="20" /> 
            
        ${element.name.official}
      </h1>
      <ul class="country-info_list">
        <li class="country-info_item">
          <h2>Capital:</h2>
          <p>${element.capital}</p>
        </li>
        <li class="country-info_item">
          <h2>Population:</h2>
          <p>${element.population}</p>
        </li>
        <li class="country-info_item">
          <h2>Languages:</h2>
          <p>${Object.values(element.languages).join(', ')}</p>
        </li>
      </ul>`;
    })
    .join('');

  countryInfo.innerHTML = markup;
}
