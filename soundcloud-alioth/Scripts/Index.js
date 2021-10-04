const jsonF = require("../Scripts/JsonF.js");

document.getElementById("btnSearch").onclick = () => {
    const scUrl = "https://soundcloud.com/";
    let searchValue = document.getElementById("txtSearch").value;

    if (searchValue.slice(0, scUrl.length) === scUrl) {
        dataJSON = jsonF.get();
        dataJSON.app_pages.song.url = searchValue;
        dataJSON.current_page = "song";
        jsonF.update(dataJSON);

        window.location.href = "./Song.html";
    } else {
        dataJSON = jsonF.get();
    
        if (searchValue === "") searchValue = dataJSON.app_pages.search.default_search;
    
        dataJSON.app_pages.search.url = `${scUrl}search/sounds?q=${searchValue}`;
        dataJSON.current_page = "search";
        jsonF.update(dataJSON);

        window.location.href = "./Search.html";
    }
};

document.getElementById("btnFavorites").onclick = () => {
    dataJSON = jsonF.get();
    dataJSON.current_page = "favorites";
    jsonF.update(dataJSON);

    window.location.href = "./Favorites.html";
};