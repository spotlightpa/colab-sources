import fetchJSON from "./fetch-json.js";

const appID = `4YY8001LKK`;
const publicKey = `7bbfad285bdadbfe564a6b2a0dcafc79`;
const indexName = `ctmirrror-sources`;

let baseURL = `https://${appID}-dsn.algolia.net/1/indexes/${indexName}?x-algolia-agent=spotlightpa&x-algolia-application-id=${appID}&x-algolia-api-key=${publicKey}&hitsPerPage=${999}&query=`;

export default function searchAPI(query) {
  if (!query) {
    return Promise.resolve(null);
  }
  return fetchJSON(baseURL + encodeURIComponent(query));
}
