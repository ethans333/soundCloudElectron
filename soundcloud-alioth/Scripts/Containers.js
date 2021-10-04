const { getData } = require("../Scripts/GetData.js"),
    electron = require('electron'),
    jsonF = require("../Scripts/JsonF.js"),
    { autoScroll, scrollToTop } = require("../Scripts/PageScroll.js");

let currentWindow = electron.remote.getCurrentWindow(),
    page = currentWindow.custom.page,
    dataJSON = jsonF.get(),
    appPage = dataJSON.app_pages[dataJSON.current_page];

const getMaxScrollY = () => document.documentElement.scrollHeight - document.documentElement.clientHeight;

const containers = async (n, createContainer, page) => {
    loading = true;
    let startIndex = 2;

    if (newPage) {
        await scrollToTop(page);
    } else {
        startIndex += lastContainer;
        n += lastContainer;
    }

    n += 2;

    for (let i = startIndex; i < n; i++) {
        songData = { ...(appPage.elements) };

        for (const [sdE, value] of Object.entries(songData)) {
            songData[sdE] = "";
        }

        await autoScroll(page);

        for (let j = 0; j < Object.entries(songData).length; j++) {
            const element = Object.entries(songData)[j][0];
            let e;

            try {
                e = await getData(page, appPage.elements[element].selector, appPage.elements[element].type, i);
            } catch (error) {
                e = await getData(page, appPage.elements_banner_art[element].selector, appPage.elements_banner_art[element].type, i);
            }
            
            songData[element] = e.data;
        }

        createContainer(songData);
    }

    lastContainer = n;
    loading = false;

    maxScrollY = getMaxScrollY();
};

let lastContainer, maxScrollY = getMaxScrollY(), loading = false, newPage = true, songData;

const createContainers = async (page, createContainer) => {
    const conPerCycle = 10;

    await containers(conPerCycle, createContainer, page);

    document.addEventListener('scroll', (e) => {
        if (Math.ceil(window.scrollY) == maxScrollY && !loading) {
            newPage = false;
            containers(conPerCycle, createContainer, page);
        }
    });
}; 

module.exports = { createContainers };

/*
    When scrolling to the bottom on Artist.js 
*/