const { getData, getAudio } = require("../Scripts/GetData.js"),
    { goto } = require("../Scripts/goto.js"),
    electron = require('electron'),
    jsonF = require("../Scripts/JsonF.js");

let dataJSON = jsonF.get();

const currentWindow = electron.remote.getCurrentWindow(),
    page = currentWindow.custom.page,
    appPage = dataJSON.app_pages[dataJSON.current_page];

let url = appPage.url;
(url.slice(0, appPage.base_url.length) != appPage.base_url) && (url = appPage.redirect_url);

const btnFavorite = document.getElementById('btnFavorite');
const jsonName = appPage.url.match(/([^\/]+$)/)[0];

if (dataJSON.favorites[jsonName] != undefined) btnFavorite.style.color = "rgb(255, 107, 156)";

(async () => {
    await goto(page, appPage.url);

    const favoriteSong = {
        url: appPage.url
    };

    for (const [key, value] of Object.entries(appPage.elements)) {
        const element = await getData(page, appPage.elements[key].selector, appPage.elements[key].type);
        document.getElementById(appPage.elements[key].document_id)[element.elemAttr] = element.data;
        favoriteSong[key] = element.data;
    }

    await page.evaluate(`(() => {
        return document.querySelector('${appPage.omitted_elements.play_button.selector}').click()
    })()`);

    const artistUrl = await page.evaluate(`(() => {
        return document.querySelector('${appPage.omitted_elements.artist_url.selector}').href
    })()`);

    document.getElementById(appPage.omitted_elements.artist_url.document_id).onclick = () => {
        let dataJSON = jsonF.get();
        dataJSON.app_pages.artist.url = `${artistUrl}/tracks`;
        dataJSON.current_page = "artist";
        jsonF.update(dataJSON);

        window.location.href = "./Artist.html";
    }

    btnFavorite.onclick = () => {
        dataJSON = jsonF.get();

        if (dataJSON.favorites[jsonName] === undefined) {
            btnFavorite.style.color = 'rgb(255, 107, 156)';
            dataJSON = jsonF.get();
            dataJSON.favorites[jsonName] = favoriteSong;
            jsonF.update(dataJSON);
        } else {
            btnFavorite.style.color = '#000';
            dataJSON = jsonF.get();
            jsonF.update(dataJSON);
            delete dataJSON.favorites[jsonName];
            jsonF.update(dataJSON);
        }
    };

    getAudio(page, undefined, url => {
        document.getElementById("audioSource").src = url;

        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.load();
        audioPlayer.play();
    });

})();