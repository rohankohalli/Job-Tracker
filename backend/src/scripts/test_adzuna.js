import axios from 'axios'

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || "3a6c3a57"
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || "774b241b95c42f64e03a7781a68fa0aa"
const ADZUNA_COUNTRY = "in"

const url = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/1`
const params = {
  app_id: ADZUNA_APP_ID,
  app_key: ADZUNA_APP_KEY,
  results_per_page: 5,
  'content-type': 'application/json',
  what: 'react'
}

console.log("Using credentials:")
console.log("App ID:", ADZUNA_APP_ID)
console.log("App Key:", ADZUNA_APP_KEY)

axios.get(url, { params })
  .then(res => {
    console.log("Success! Results count:", res.data.count)
  })
  .catch(err => {
    console.error("Failed with full error detail:", err)
  })
