import { getFandomLyrics, getAzLyrics } from './lyrics'
import { youtubeSearch } from './youtube-search'

function fetchLyrics(song) {
    const { title, artist } = song

    chrome.storage.local.set({ 'lyricsData': { state: 'fetching', lyrics: '' } })

    const onSuccess = (lyrics) => {
        chrome.storage.local.get('lyricsData', (lyricsData) => {
            if (lyricsData.state !== 'success') {
                chrome.storage.local.set({ 'lyricsData': { state: 'success', lyrics } })
                renderComponent()
            }
        })
    }

    const onFailure = () => {
        chrome.storage.local.get('lyricsData', (lyricsData) => {
            if (lyricsData.state !== 'success')
                chrome.storage.local.set({ 'lyricsData': { state: 'fail', lyrics: '' } })
        })
    }

    for (let i = 0; i < artist.length; i++) {
        getFandomLyrics(title, artist[i], onSuccess, onFailure);
        getAzLyrics(title, artist[i], onSuccess, onFailure);
    }
}

export default fetchApi;