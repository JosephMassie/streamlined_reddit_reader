export type RedditListingOptions = {
    before?: string | null;
    after?: string | null;
    count?: string;
};

export interface SubRedditsResponse extends Response {
    data: {
        children: Array<{ data: SubRedditData }>;
        before: string | null;
        after: string | null;
    };
}

export type SubRedditData = {
    display_name: string;
    description: string;
    type: string;
};

interface RedditPostResponse extends Response {
    data: Record<string, string>;
}

export type RedditPost = {
    title: string;
    author: string;
    permalink: string;
    num_comments: number;
    selftext_html?: string;
    url?: string;
};

export type RedditPostData = {
    children: Array<{ data: RedditPost }>;
};

export type FeedData = Record<string, RedditPostData>;
