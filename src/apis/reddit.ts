import {
    RedditListingOptions,
    SubRedditsResponse,
    FeedData,
    RedditPostData,
    RedditPostResponse,
} from '@/reddit';

export const REDDIT_URL = 'https://www.reddit.com';

const buildParams = (params: Record<string, string | null>) =>
    Object.keys(params)
        .filter((key) => params[key] !== null)
        .map((key) => `${key}=${params[key]}`)
        .join('&');

export const getSubreddits = async (
    search: string,
    options: RedditListingOptions = {}
) => {
    let url = `${REDDIT_URL}/subreddits`;

    const { before, after, count } = options;

    if ((before || after) && !count) {
        console.warn(
            `invalid request options must include count if using before or after`
        );
    }

    const params = buildParams(options);

    if (search !== '') {
        url = `${url}/search.json?q=${search}&${params}`;
    } else {
        url = `${url}.json?${params}`;
    }

    const response = (await fetch(url).then((r) =>
        r.json()
    )) as SubRedditsResponse;

    return response.data;
};

export async function getPots(
    subreddit: string,
    options: RedditListingOptions = {}
): Promise<RedditPostData> {
    const { before, after, count } = options;

    if ((before || after) && !count) {
        console.warn(
            `invalid request options must include count if using before or after`
        );
    }

    const params = buildParams(options);

    const response = (await fetch(
        `${REDDIT_URL}/r/${subreddit}.json?${params}`
    )) as RedditPostResponse;

    return (await response.json()).data;
}
