// Using https://api.warframestat.us/PC/ and https://oracle.browse.wf/ APIs
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
}
// fetchData("").then(result => console.log(result))
module.exports = fetchData;