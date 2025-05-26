import { ReactNode } from 'react';
import sanitizeHtml from 'sanitize-html';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';

import { RedditPost } from '@/reddit';
import { REDDIT_URL } from '@/apis/reddit';
import { createMarkup, parseHtml } from '@/lib/utils';

const Post = ({ data }: { data: RedditPost }): ReactNode => {
    const { permalink, title, author, num_comments, url, selftext_html } = data;
    const linkToPost = `${REDDIT_URL}${permalink}`;

    return (
        <Card
            key={title}
            className="bg-red-800 border-none"
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
                        className="font-bold text-2xl col-span-2 leading-4 text-gray-100"
                    >
                        {title}
                    </a>
                </CardTitle>
                <CardDescription className="pl-2 text-gray-300 whitespace-nowrap text-xs">
                    <span className="font-semibold">By:</span> u/
                    {author}
                    <span className="ml-3 font-semibold">Comments: </span>
                    {num_comments}
                </CardDescription>
            </CardHeader>
            <CardContent className="break-all">
                {url && url !== linkToPost && (
                    <a href={url} target="_about" className="text-gray-200">
                        {url}
                    </a>
                )}
                {selftext_html && (
                    <div
                        className="px-4 text-gray-200 overflow-hidden text-ellipsis line-clamp-6 [&_ul]:list-disc [&_li]:ml-4"
                        dangerouslySetInnerHTML={createMarkup(
                            sanitizeHtml(parseHtml(selftext_html))
                        )}
                    ></div>
                )}
            </CardContent>
        </Card>
    );
};

export default Post;
