# affordability-calculator

Estimate the income required for a particular home by inputting the various parameters (mortgage rate, downpayment, loan term, etc.). Then
based on the qualifying DTI (Debt-to-Income) chosen, a required salary will be calculated.

Selecting the MSA associated with the home calculates the percentage of a given MSAs population would be able to qualify for a loan to buy this home.

Additionally, you can adjust the loan parameter to better understand the sensitivity to various parameters such as interest rates.

### Requirements
- [Docker](https://www.docker.com/)
- [Census API Key](https://api.census.gov/data/key_signup.html)


### Running locally
Create `.env` file in `./api` with relevant settings
```
CENSUS_API_KEY=YOUR_API_KEY
DEBUG=true
HOST=0.0.0.0
PORT=5000
```

```
docker-compose up
```

### Deploy
```
eval $(docker-machine env priced-out) # connect to instance
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
eval $(docker-machine env priced-out -u) 
```

### Demo
A [home affordability calculator](http://affordability-calculator.matthewkrump.com) that makes use of the [2018 ACS income data]("https://www.census.gov/data/developers/data-sets/acs-1year.html"). Based on a [NAHB's "priced-out" analysis](https://www.nahb.org/News-and-Economics/Housing-Economics/Housings-Economic-Impact/Households-Priced-Out-by-Higher-House-Prices-and-Interest-Rates)
