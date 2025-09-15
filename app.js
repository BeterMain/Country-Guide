const country = {
  name: null,
  capital: null,
  population: null,
  currency: null,
  commonLang: null,
  flag: null,
};

let countryInfo = document.getElementById("countryInfo");
let countriesGrid = document.getElementById("countriesGrid");

let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", search);

async function search() {
  // Check for input validity
  let countryName = searchInput.value.trim().toLowerCase();

  if (!isNaN(countryName)) return;
  if (!countryName) return;

  var newCountry = Object.create(country);
  // Call api
  fetch(`https://restcountries.com/v3.1/name/${countryName}`)
    .then((response) => response.json())
    .then((data) => {
      let info = data["0"];
      // Name
      newCountry.name = info["name"]["official"];

      // Capital
      newCountry.capital = info["capital"][0];

      // Population
      newCountry.population = info["population"];

      // Currency
      let abbreviation = Object.keys(info["currencies"])[0];
      newCountry.currency = {
        abbreviation: abbreviation,
        name: info["currencies"][abbreviation]["name"],
        symbol: info["currencies"][abbreviation]["symbol"],
      };

      // Languages
      newCountry.commonLang = [];
      let langs = Object.values(info["languages"]);
      for (let i = 0; i < langs.length; i++) {
        newCountry.commonLang.push(langs[i]);
      }

      // Flag
      newCountry.flag = info["flags"]["png"];

      // Present these details in object to screen
      let infoSection = document.createElement("p");
      infoSection.classList.add("countryInfo");

      infoSection.innerHTML = `
      <h1>${newCountry.name}</h1>
      <strong>Capital: </strong> 
      ${newCountry.capital} <br> <br>
      <strong>Population: </strong> 
      ${newCountry.population} <br> <br>
      <strong>Currency: </strong> 
      ${newCountry.currency.name} - ${
        newCountry.currency.abbreviation
      } <br> <br>
      <strong>Common Language: </strong> 
      ${presentLanguages(newCountry.commonLang)} <br> <br>
      `;

      countryInfo.textContent = "";
      countryInfo.appendChild(infoSection);

      let flagSection = document.createElement("img");
      flagSection.setAttribute("src", newCountry.flag);
      flagSection.classList.add("countriesGrid");

      countriesGrid.replaceChildren(flagSection);
    })
    .catch((error) => console.error("Error: ", error));

  // Reset text and stuff
  searchInput.textContent = "";
}

function presentLanguages(array) {
  let languages = array[0];

  for (let i = 1; i < array.length; i++) {
    languages += ", " + array[i];
  }

  return languages;
}
