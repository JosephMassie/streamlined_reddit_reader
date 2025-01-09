'use client';

import { ReactNode, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

import { LoadingWheel } from '@/components/loading_wheel';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface RawRedditData extends Response {
    data: Record<string, string>;
}

interface RedditPost {
    title: string;
    author: string;
    permalink: string;
    num_comments: number;
    selftext_html?: string;
    url?: string;
}

interface RedditData {
    children: Array<{ data: RedditPost }>;
}

type FeedData = Record<string, RedditData>;

const redditUrl = 'https://www.reddit.com';

async function loadFeed(feeds: string[]): Promise<FeedData> {
    if (feeds.length === 0) {
        throw new TypeError('no feeds available to load');
    }

    let results: Record<string, RedditData> = {};

    for (let f of feeds) {
        const response = (await fetch(
            `${redditUrl}/r/${f}.json`,
            {}
        )) as RawRedditData;
        results[f] = (await response.json()).data;
    }

    return results;
}

function parseHtml(a_html: string) {
    if (typeof a_html !== 'string') return '';
    const html = a_html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'");
    console.log('parsed', html);

    return html;
}

const createMarkup = (unsafeHtml: string) => ({
    __html: unsafeHtml,
});

const buildPost = (post: RedditPost, index: number): ReactNode => {
    const linkToPost = `${redditUrl}${post.permalink}`;

    return (
        <Card
            key={index}
            className="mt-4 bg-red-700 border-red-700"
            style={{
                gridTemplateColumns: 'min-content 1fr',
                gridTemplateRows: 'min-content min-content 1fr',
            }}
        >
            <CardHeader>
                <CardTitle>
                    <a
                        href={linkToPost}
                        target="_about"
                        className="font-bold text-xl col-span-2 leading-4"
                    >
                        {post.title}
                    </a>
                </CardTitle>
                <CardDescription className="pl-2 text-gray-100 whitespace-nowrap text-xs">
                    <span className="font-semibold">By:</span> u/
                    {post.author}
                    <span className="ml-3 font-semibold">Comments: </span>
                    {post.num_comments}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Collapsible>
                    <CollapsibleTrigger className="mb-2">
                        <Button variant="secondary">Toggle Content</Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {post.url && post.url !== linkToPost && (
                            <div className="whitespace-nowrap overflow-hidden">
                                <a
                                    href={post.url}
                                    target="_about"
                                    className="block max-w-full overflow-hidden overflow-ellipsis"
                                >
                                    {post.url}
                                </a>
                            </div>
                        )}
                        {post.selftext_html && (
                            <div
                                className="px-4 text-white"
                                dangerouslySetInnerHTML={createMarkup(
                                    sanitizeHtml(parseHtml(post.selftext_html))
                                )}
                            ></div>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
};

const displayFeed = (feed: FeedData): React.ReactNode => {
    return (
        <>
            {Object.keys(feed).map((topic, i) => {
                const posts = feed[topic].children;
                return (
                    <Collapsible
                        key={i}
                        className="mt-4 p-4 bg-gray-800 rounded-xl"
                        defaultOpen={true}
                    >
                        <CollapsibleTrigger className="flex w-full hover:italic">
                            <h2 className="text-left text-4xl text-white font-bold">
                                r/{topic}
                            </h2>
                            <ChevronsUpDown className="ml-auto mr-0 w-10 h-10 text-white" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="mt-2">
                                {posts.map(({ data: post }, i) =>
                                    buildPost(post, i)
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                );
            })}
        </>
    );
};

type FeedState = 'empty' | 'loading' | 'filled';

export default function Feed({ topics = ['news'] }: { topics?: string[] }) {
    const [feedData, setFeedData] = useState({} as FeedData);
    const [state, setState] = useState('empty' as FeedState);

    // Perform a single initial load
    if (topics.length > 0 && state === 'empty') {
        setState('loading');
        loadFeed(topics).then((f) => {
            setState('filled');
            setFeedData(f);
        });
    }

    return (
        <>
            <Button
                className="relative mt-2 mx-auto sm:mx-0"
                disabled={topics.length === 0}
                onClick={() => {
                    setState('loading');

                    loadFeed(topics).then((f) => {
                        setState('filled');
                        setFeedData(f);
                    });
                }}
            >
                Reload Feed
            </Button>
            <div className="flex flex-col mt-4">
                {state === 'empty' && (
                    <div className="text-3xl">Feed is empty</div>
                )}
                {state === 'loading' && <LoadingWheel />}
                {state === 'filled' && displayFeed(feedData)}
            </div>
        </>
    );
}
