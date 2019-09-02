import YTSearch from 'youtube-api-search';
import { YOUTUBE_API_KEYS } from '../../config'

const youtubeSearch = (keyword, successCallback) => {
    YTSearch({ key: YOUTUBE_API_KEYS[0], term: keyword }, videos => {
        successCallback(videos)
    });
}

export default youtubeSearch
