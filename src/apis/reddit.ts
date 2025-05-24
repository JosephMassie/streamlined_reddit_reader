import {
    SubRedditData,
    RawSubRedditData,
    FeedData,
    RedditPostData,
    RawRedditPostData,
} from '@/reddit';

export const REDDIT_URL = 'https://www.reddit.com';

export const getSubreddits = async (
    search: string
): Promise<SubRedditData[]> => {
    let url = `${REDDIT_URL}/subreddits`;

    if (search !== '') {
        url = `${url}/search.json?q=${search}`;
    } else {
        url = `${url}.json`;
    }

    const response = (await fetch(url).then((r) =>
        r.json()
    )) as RawSubRedditData;

    const subReddits = response.data.children.map((sub) => {
        const { display_name, description, type } = sub.data;
        return { display_name, description, type } as SubRedditData;
    });

    return subReddits;
};

export async function loadFeed(feeds: string[]): Promise<FeedData> {
    if (feeds.length === 0) {
        throw new TypeError('no feeds available to load');
    }

    let results: Record<string, RedditPostData> = {};

    for (let f of feeds) {
        const response = (await fetch(
            `${REDDIT_URL}/r/${f}.json`
        )) as RawRedditPostData;
        results[f] = (await response.json()).data;
    }

    return results;
}
