const { createContainers } = require("../Scripts/Containers.js"),
      { fixLongText } = require("../Scripts/FixText.js"),
      { getData } = require("../Scripts/GetData.js"),
      { goto } = require("../Scripts/goto.js"),
      jsonF = require("../Scripts/JsonF.js"),
      electron = require('electron');

let currentWindow = electron.remote.getCurrentWindow(),
    page = currentWindow.custom.page,
    dataJSON = jsonF.get(),
    appPage = dataJSON.app_pages[dataJSON.current_page];

(async () => {
    await goto(page, appPage.url);

    const renderInfo = async (eId, jsonKey, extras) => {
        const e = await getData(page, appPage.omitted_elements[jsonKey].selector, appPage.omitted_elements[jsonKey].type);
        document.getElementById(eId)[e.elemAttr] = extras + e.data;
    };

    const elements = [
        {eId: "imgArtist", jsonKey: "artist_image", extras: ""},
        {eId: "lblFollowers", jsonKey: "followers", extras: "Followers "},
        {eId: "lblTracks", jsonKey: "tracks", extras: "Tracks "}
    ];

    elements.forEach(element => {
        renderInfo(element.eId, element.jsonKey, element.extras);
    });

    createContainers(await page, createContainer);
})();

const createContainer = (_songData) => {
    document.getElementById("lblArtist").innerText = _songData.artist;

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

    for (let i = 0; i < 3; i++) {
        items.push(document.createElement('p'));
    }
    
    items[0].innerText = fixLongText(_songData.title);
    items[0].className = "lblButton";
    items[0].onclick = () => {
        let dataJSON = jsonF.get();
        dataJSON.app_pages.song.url = _songData.song_url;
        dataJSON.current_page = "song";
        jsonF.update(dataJSON);

        window.location.href = "./Song.html";
    };

    items[1].innerText = fixLongText(_songData.artist);
    items[2].innerText = `▶ ${fixLongText(_songData.plays)}`;

    childDivs[0].appendChild(items[0]);
    childDivs[0].appendChild(items[1]);
    childDivs[1].appendChild(items[2]);

    const br = document.createElement('br');
    document.getElementById("infoContainer").appendChild(br);
};