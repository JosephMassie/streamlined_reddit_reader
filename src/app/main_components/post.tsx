import { ReactNode } from 'react';
import sanitizeHtml from 'sanitize-html';

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

import { RedditPost } from '@/reddit';
import { REDDIT_URL } from '@/apis/reddit';
import { createMarkup, parseHtml } from '@/lib/utils';

const Post = ({ data }: { data: RedditPost }): ReactNode => {
    const { permalink, title, author, num_comments, url, selftext_html } = data;
    const linkToPost = `${REDDIT_URL}${permalink}`;

    return (
        <Card
            key={title}
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
                        {title}
                    </a>
                </CardTitle>
                <CardDescription className="pl-2 text-gray-100 whitespace-nowrap text-xs">
                    <span className="font-semibold">By:</span> u/
                    {author}
                    <span className="ml-3 font-semibold">Comments: </span>
                    {num_comments}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Collapsible>
                    <CollapsibleTrigger className="mb-2">
                        <div className="rounded-md bg-white py-2 px-4">
                            Toggle Content
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {url && url !== linkToPost && (
                            <div className="whitespace-nowrap overflow-hidden">
                                <a
                                    href={url}
                                    target="_about"
                                    className="block max-w-full overflow-hidden overflow-ellipsis"
                                >
                                    {url}
                                </a>
                            </div>
                        )}
                        {selftext_html && (
                            <div
                                className="px-4 text-white"
                                dangerouslySetInnerHTML={createMarkup(
                                    sanitizeHtml(parseHtml(selftext_html))
                                )}
                            ></div>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
};

export default Post;
