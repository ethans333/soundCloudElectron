const jsonF = require("../Scripts/JsonF.js"),
    { getAudio } = require("../Scripts/GetData.js"),
    electron = require('electron');

let currentWindow = electron.remote.getCurrentWindow(),
    page = currentWindow.custom.page,
    dataJSON = jsonF.get()
    audioElements = [];

const createContainer = (imgSrc, title, artist, i) => {
    const songContainer = document.createElement("div");
    songContainer.className = "songContainer";
    document.body.appendChild(songContainer);

    const image = document.createElement("img");
    image.id = "imgAlbumCover";
    image.src = imgSrc;
    songContainer.appendChild(image);

    const songContainerItems = document.createElement("div");
    songContainerItems.className = "songContainerItems";
    songContainer.appendChild(songContainerItems);

    const items = [
        document.createElement("p"),
        document.createElement("p")
    ];

    items[0].innerText = title;
    items[0].className = "lblButton";

    items[1].innerText = artist;
    items[1].className = "lblButton";

    songContainerItems.appendChild(items[0]);
    songContainerItems.appendChild(items[1]);

    const audioContainer = document.createElement("div");
    audioContainer.className = "songContainer";
    songContainerItems.appendChild(audioContainer);

    const audio = document.createElement("audio");
    audio.controls =  true;
    audio.id = `audioPlayer_${i}`;
    audioContainer.appendChild(audio);

    const source = document.createElement("source");
    source.id = `audioSource_${i}`;

    audio.appendChild(source);

    audioElements.push({ audioplayer: audio, source: source });

    const btnFav = document.createElement("p");
    btnFav.className = "lblButton";
    btnFav.id = "btnFavorite";
    btnFav.innerText = "❤";
    audioContainer.appendChild(btnFav);

    document.body.appendChild(document.createElement("br"));
};

(async () => {
    const favorites = dataJSON.favorites;

    let i = 0;
    for (const [key, value] of Object.entries(favorites)) {
        const song = favorites[key];
        
        createContainer(song.image, song.title, song.artist, i);
        i += 1;
    }
    
    /*
    let j = 0;
    for (const [key, value] of Object.entries(favorites)) {
        const song = favorites[key];

        await page.goto(song.url, {
            waitUntil: 'networkidle2',
        });

        await page.evaluate(`(() => {
            return document.querySelector('${dataJSON.app_pages.song.omitted_elements.play_button.selector}').click()
        })()`);

        await getAudio(page, dataJSON.app_pages.song.omitted_elements.play_button.selector, url => {
            console.log(url);

            document.getElementById(`audioSource_${j}`).src = url;
            document.getElementById(`audioPlayer_${j}`).load();
        });

        j += 1;
    }
    */

    
    let song = favorites["white-widow"];

    await page.goto(song.url, {
        waitUntil: 'networkidle2',
    });

    await page.evaluate(`(() => {
        return document.querySelector('${dataJSON.app_pages.song.omitted_elements.play_button.selector}').click()
    })()`);

    await getAudio(page, dataJSON.app_pages.song.omitted_elements.play_button.selector, url => {
        console.log(url);

        document.getElementById(`audioSource_${0}`).src = url;
        document.getElementById(`audioPlayer_${0}`).load();
    });

    /*
     
    song = favorites["vans"];

    await page.goto(song.url, {
        waitUntil: 'networkidle2',
    });

    await page.evaluate(`(() => {
        return document.querySelector('${dataJSON.app_pages.song.omitted_elements.play_button.selector}').click()
    })()`);

    await getAudio(page, dataJSON.app_pages.song.omitted_elements.play_button.selector, url => {
        console.log(url);

        document.getElementById(`audioSource_${1}`).src = url;
        document.getElementById(`audioPlayer_${1}`).load();
    });
    */
})();