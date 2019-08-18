import { getFandomLyrics, getAzLyrics } from './lyrics'
import { youtubeSearch } from './youtube-search'

const fetchApi = (storage, songDetails, render) => {
    const { title, artist } = songDetails

    const onSuccessLyrics = (lyrics) => {
        storage.get('store', (store) => {
            if (store.lyrics.state !== 'success')
                store.lyrics = { state: 'success', lyrics }
            storage.set('store', store)
            render(store.mode, store.song, store.lyrics, store.youtubeVideos)
        })
    }

    const onFailureLyrics = () => {
        storage.get('store', (store) => {
            if (store.lyrics.state === 'fetching')
                store.lyrics = { state: 'fail', lyrics: '' }
            storage.set('store', store)
            render(store.mode, store.song, store.lyrics, store.youtubeVideos)
        })
    }

    for (let i = 0; i < artist.length; i++) {
        getFandomLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
        getAzLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
    }

    youtubeSearch(title + ' ' + artist.join(' '), (videos) => {
        storage.get('store', (store) => {
            store.youtubeVideos = { state: 'success', videos }
            storage.set('store', store)
            render(store.mode, store.song, store.lyrics, store.youtubeVideos)
        })
    })
}

export default fetchApi;