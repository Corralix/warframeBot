export async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
}

// fetchData('https://oracle.browse.wf/bounty-cycle')
//     .then(data => {
//         console.log(data); // Process the data as needed
//     }
//     )
//     .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//     });
