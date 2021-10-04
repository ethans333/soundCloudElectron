const scrollToTop = async (page) => {
    const scrollHeight = await page.evaluate(`(() => {
        return window.scrollY;
    })()`);

    if (scrollHeight != 0) {
        await page.evaluate(`(() => {
            window.scrollTo(0, 0);
        })()`);
        
        await page.waitForTimeout(500);
    }

    return null;
}

const autoScroll = async (page) => {
    await page.evaluate(`(() => {
        for (let i = 0; i < 3; i++) {
            window.scrollBy(0, 200);
        }
    })()`);

    await page.waitForTimeout(100);

    return null;
}

module.exports = { autoScroll, scrollToTop };