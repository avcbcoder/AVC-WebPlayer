import { getFandomLyrics, getAzLyrics } from './lyrics'
import youtubeSearch from './youtube-search'
import { STORE_VAR } from '../constants'


const saveAndRender = (storage, store, render) => {
    storage.set({ 'store': store }, function () {
        render()
    })
}

const fetchApi = (storage, songDetails, render) => {
    const { title, artist } = songDetails

    const onSuccessLyrics = (lyrics) => {
        storage.get(['store'], (result) => {
            const store = result.store
            if (store[STORE_VAR.LYRICS].state !== 'success')
                store[STORE_VAR.LYRICS] = { state: 'success', data: lyrics }
            saveAndRender(storage, store, render)
        })
    }

    const onFailureLyrics = () => {
        storage.get(['store'], (result) => {
            const store = result.store
            if (store[STORE_VAR.LYRICS].state === 'fetching')
                store[STORE_VAR.LYRICS] = { state: 'fail', data: '' }
            saveAndRender(storage, store, render)
        })
    }

    for (let i = 0; i < artist.length; i++) {
        getFandomLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
        getAzLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
    }

    youtubeSearch(title + ' ' + artist.join(' '), (videos) => {
        storage.get(['store'], (result) => {
            const store = result.store
            store[STORE_VAR.YOUTUBE] = { state: 'success', data: videos }
            saveAndRender(storage, store, render)
        })
    })
}

export default fetchApi;