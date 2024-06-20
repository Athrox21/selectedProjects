function addOption(text, value) {
    let select = document.getElementById("results");
    option = document.createElement( 'option' );
    option.value = value;
    option.text = text;
    select.add( option );
}

function clearOptions() {
    let select= document.getElementById("results");
    select.innerHTML = "";
}

function search() {
    let searchText = document.getElementById("searchtext").value;
    searchText = searchText.replace(' ', '+');

    let queryUrl = `https://nominatim.openstreetmap.org/search.php?q=${searchText}&format=jsonv2`;
    fetch(queryUrl)
      .then(response => response.json())
      .then(data => parseResult(data))
      .catch(error => console.error('Error:', error));
}

function parseResult(result) {
    clearOptions();

    for (let id in result) {
        let entry = result[id];
        addOption(entry.display_name, `${entry.lat},${entry.lon}`);
    }
    document.getElementById("fetchedresults").innerHTML = 
    `<p>Fetched Results: ${entry.lat},${entry.lon}</p>`
    ;
}