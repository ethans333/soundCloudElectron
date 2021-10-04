module.exports = {
    goto: async (page, url) => {
        const loadingScreen = document.createElement("div");
        loadingScreen.id = "loadingContainer";
        document.body.appendChild(loadingScreen);
        
        const loadingImage = document.createElement("img");
        loadingImage.src = "../Images/Togepi-Pikachu-Loading.gif";
        loadingImage.id = "loadingImage";
        loadingScreen.appendChild(loadingImage);

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        document.body.removeChild(loadingScreen);
    }
};