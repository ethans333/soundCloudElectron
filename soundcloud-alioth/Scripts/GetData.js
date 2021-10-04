const request_client = require('request-promise-native');

const getData = async ( page, element, type, listIndex ) => {
    let e = {
        data: "",
        elemAttr: ""
    };

    if (typeof listIndex != 'undefined') {
        const regex = /^(.*?)(nth-child[(][-+]?\d+[)])/;

        let regexArr = element.match(regex);
        const remaining = element.slice(regexArr[0].length);

        regexArr = regexArr[0].replace(/\d/g, listIndex.toString());

        element = regexArr.concat(remaining);
    }

    switch (type) {
        case "text":
            e.elemAttr = "innerText";

            e.data = await page.evaluate(`(() => {
                return document.querySelector('${element}').innerText
            })()`);
            
            break;
        case "image":
            e.elemAttr = "src";

            try {
                e.data = (await page.evaluate(`(() => {
                    return document.querySelector('${element}').style.backgroundImage
                })()`)).match(/url\(["']?([^"']*)["']?\)/)[1];
    
            } catch (error) {
                e.data = "../Images/Togepi-No-Image.png";
            }

            break;
        case "href":
            e.elemAttr = "href";

            e.data = (await page.evaluate(`(() => {
                return document.querySelector('${element}').href
            })()`));
            break;
        default:
            console.log(`${type} is an invalid element type.`);

            break;
    }

    return e;
};

const getAudio = async (page, playButton, func) => {
    let result = [], gotUrl = false;

    if (!gotUrl) await page.setRequestInterception(true);

    if (typeof playButton == 'undefined') playButton = appPage.omitted_elements.play_button.selector;

    await page.on('request', request => {
        request_client({
            uri: request.url(),
            resolveWithFullResponse: true,
        }).then(async () => {
            const request_url = request.url();

            result.push({
                request_url
            });

            let url = result[result.length-1].request_url;

            if (url.includes("https://cf-hls-media.sndcdn.com/media")) {
                gotUrl = true;
                request.abort();

                let urlArray = url.split("/"), startFinish = [];

                urlArray.forEach(i => {
                    if(!isNaN(parseFloat(i)) && isFinite(i)){
                        startFinish.push(i)
                    }
                });

                await page.evaluate(`(() => {
                    return document.querySelector('${playButton}').click()
                })()`);

                url = url.replace(startFinish[0], '0');
                url = url.replace(startFinish[1], '10000000');
                
                await func(url);

                await page.setRequestInterception(false);
            }
            
        }).catch(error => {
            request.abort();
        });
    });
};

module.exports = { getData, getAudio };