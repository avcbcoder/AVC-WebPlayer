import { getFandomLyrics, getAzLyrics } from './lyrics'
import youtubeSearch from './youtube-search'


const saveAndRender = (storage, store, render) => {
    storage.set({ 'store': store }, function () {
        render(store.mode, store.song, store.lyrics, store.youtubeVideos)
    })
}

const fetchApi = (storage, songDetails, render) => {
    const { title, artist } = songDetails

    const onSuccessLyrics = (lyrics) => {
        storage.get(['store'], (result) => {
            const store = result.store
            if (store.lyrics.state !== 'success')
                store.lyrics = { state: 'success', lyrics }
            saveAndRender(storage, store, render)
        })
    }

    const onFailureLyrics = () => {
        storage.get(['store'], (result) => {
            const store = result.store
            if (store.lyrics.state === 'fetching')
                store.lyrics = { state: 'fail', lyrics: '' }
            saveAndRender(storage, store, render)
        })
    }

    for (let i = 0; i < artist.length; i++) {
        getFandomLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
        getAzLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
    }

    youtubeSearch(title + ' ' + artist.join(' '), (videos) => {
        console.log(432, videos)
        storage.get(['store'], (result) => {
            const store = result.store
            store.youtubeVideos = { state: 'success', videos }
            saveAndRender(storage, store, render)
        })
    })
}

export default fetchApi;