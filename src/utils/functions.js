import { SUPPORTED_SITES } from '../constants'

const identifySite = (url) => {
    if (url.includes('youtube.com/watch'))
        return SUPPORTED_SITES.YOUTUBE;
}

export { identifySite }