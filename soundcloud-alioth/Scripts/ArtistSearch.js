const { createContainers } = require("../Scripts/Containers.js"),
      { goto } = require("../Scripts/goto.js"),
      { fixLongText } = require("../Scripts/FixText.js");
      jsonF = require("../Scripts/JsonF.js"),
      electron = require('electron');

let currentWindow = electron.remote.getCurrentWindow(),
    page = currentWindow.custom.page,
    dataJSON = jsonF.get(),
    appPage = dataJSON.app_pages[dataJSON.current_page];

const createContainer = (_songData) => {
    const parentDiv = document.createElement('div');
    parentDiv.className = "songContainer";
    document.getElementById("infoContainer").appendChild(parentDiv);

    const image = document.createElement('img');
    image.src = _songData.image;
    image.id = "imgAlbumCover";
    parentDiv.appendChild(image);

    const childDivs = [
        document.createElement('div'),
        document.createElement('div')
    ];

    childDivs[0].className = "songContainerItems";
    childDivs[1].className = "songContainerItems";
    parentDiv.appendChild(childDivs[0]);
    parentDiv.appendChild(childDivs[1]);

    let items = [];

    for (let i = 0; i < 4; i++) {
        items.push(document.createElement('p'));
    }
    
    items[0].innerText = fixLongText(_songData.artist_name, 20);
    items[0].className = "lblButton";
    items[0].onclick = () => {
        let dataJSON = jsonF.get();
        dataJSON.app_pages.artist.url = `${_songData.artist_url}/tracks`;
        dataJSON.current_page = "artist";
        jsonF.update(dataJSON);

        window.location.href = "./Artist.html";
    };

    childDivs[0].appendChild(items[0]);

    const br = document.createElement('br');
    document.getElementById("infoContainer").appendChild(br);
};

(async () => {
    await goto(page, appPage.url);

    createContainers(page, createContainer);
})();

document.getElementById("btnTrackSearch").onclick = () => {
    dataJSON = jsonF.get();

    dataJSON.app_pages.search.url = dataJSON.app_pages.artist_search.url.replace("search/people?q=", "search/sounds?q=");
    dataJSON.current_page = "search";
    jsonF.update(dataJSON);

    window.location.href = "./Search.html";
};
