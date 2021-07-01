// Utility for making multiple fetch requests at the same time
function getAll(url1, url2, url3, url4) {
    let promises = []
    if (url1) {
        let promise = fetch(url1)
        promises.push(promise.then(res => res.json()))
    }
    if (url2) {
        let promise = fetch(url2)
        promises.push(promise.then(res => res.json()))
    }
    if (url3) {
        let promise = fetch(url3)
        promises.push(promise.then(res => res.json()))
    }
    if (url4) {
        let promise = fetch(url4)
        promises.push(promise.then(res => res.json()))
    }
    return Promise.all(promises)
}