const { Toast } = require("./libs/easy-jsbox")

function getUrls() {
    const input = (() => {
        const inputList = [$actions.inputValue, $clipboard.text]
        for (let i = 0; i < inputList.length; i++) {
            if (inputList[i] && inputList[i] !== "") {
                return inputList[i]
            }
        }
        return ""
    })()

    const regex = /(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([:0-9])*([\/\w\#\.\-\?\=\&])*\s?/gi
    return input.match(regex) ?? []
}

async function main() {
    const b23url = getUrls()[0]
    if (!b23url) {
        Toast.warning($l10n("b23clear.noUrl"))
    } else if (b23url.indexOf("bilibili.com") === -1 && b23url.indexOf("b23.tv") === -1) {
        Toast.warning($l10n("b23clear.noBiliUrl"))
    } else {
        Toast.info($l10n("b23clear.converting"), { font: $font(20) })
        let url
        if (b23url.indexOf("b23.tv")) {
            const resp = await $http.get(b23url)
            url = resp.response.url
        }

        const bvUrl = url.substring(0, url.indexOf("?") - 1)
        $ui.alert({
            title: $l10n("b23clear.success"),
            message: bvUrl,
            actions: [
                { title: $l10n("OK") },
                {
                    title: $l10n("COPY"),
                    handler: () => {
                        $clipboard.text = bvUrl
                        Toast.success($l10n("COPIED"))
                    }
                }
            ]
        })
    }
}

module.exports = {
    run: () => {
        main().catch(error => console.error(error))
    }
}
