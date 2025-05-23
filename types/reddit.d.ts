export interface RawSubRedditData extends Response {
    data: {
        children: Array<{ data: SubRedditData }>;
    };
}

export type SubRedditData = {
    display_name: string;
    description: string;
    type: string;
};

interface RawRedditPostData extends Response {
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
