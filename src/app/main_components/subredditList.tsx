import { HTMLProps, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { micromark } from 'micromark';
import sanitizeHtml from 'sanitize-html';

import { Button } from '@/components/ui/button';

import { LoadingWheel } from '@/components/loading_wheel';
import { RedditListingOptions } from '@/reddit';
import { getSubreddits } from '@/apis/reddit';
import ErrorMsg from '@/components/errorMsg';
import { createMarkup } from '@/lib/utils';

type SubredditListProps = HTMLProps<HTMLDivElement> & {
    search: string;
    userTopics: string[];
    addTopic: (topic: string) => void;
};

type QueryState = {
    page: number;
    listOpts: RedditListingOptions;
};

const entriesPerPage = 25;

const SubredditList: React.FC<SubredditListProps> = ({
    search,
    userTopics,
    addTopic,
}) => {
    const [queryState, setQueryState] = useState<QueryState>({
        page: 1,
        listOpts: {},
    });

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ['topics', search, JSON.stringify(queryState.listOpts)],
        queryFn: () => getSubreddits(search, queryState.listOpts),
    });

    const updateOptions = (options: RedditListingOptions) => {
        console.log(`received new listing options`, options);

        setQueryState((old) => {
            const updated = { ...old };
            let entries = 0;

            if (options.after) {
                updated.page++;
                entries = updated.page * entriesPerPage;
            } else if (options.before) {
                updated.page--;
                entries = updated.page * entriesPerPage + 1;
            } else {
                console.error(`malformed listing options`, options);
            }

            console.log(
                `updating query state for page ${updated.page}`,
                updated
            );

            updated.listOpts = {
                ...updated.listOpts,
                ...options,
                count: entries.toString(),
            };
            return updated;
        });
    };

    if (isLoading) {
        return <LoadingWheel />;
    }

    if (isError) {
        return (
            <ErrorMsg msg={`Error loading subreddits "${error.toString()}"`} />
        );
    }

    if (!data) {
        return <ErrorMsg msg='Error loading subreddits "data corrupted"' />;
    }

    return (
        <div>
            <div className="sticky top-0 bg-gray-400 p-2 z-10 flex justify-end gap-2">
                {data?.before && (
                    <Button
                        onClick={() => {
                            updateOptions({ before: data.before, after: null });
                        }}
                    >
                        Prev
                    </Button>
                )}
                {data?.after && (
                    <Button
                        onClick={() => {
                            updateOptions({
                                before: null,
                                after: data.after,
                            });
                        }}
                    >
                        Next
                    </Button>
                )}
            </div>
            <div className="transition-all flex flex-col">
                {Array.isArray(data?.children) &&
                    data.children.map((subredditData, i) => {
                        const { display_name, description } =
                            subredditData.data;
                        const isIncluded = userTopics.includes(display_name);

                        return (
                            <div
                                key={`${display_name}_${i}`}
                                className={clsx(
                                    'h-full grid auto-rows-min gap-y-2 gap-x-4 rounded-md bg-red-700 text-white leading-4 transition-all overflow-hidden duration-500',
                                    {
                                        'max-h-screen p-2 mb-4 last:mb-0':
                                            !isIncluded,
                                        'max-h-0 mb-0 p-0 opacity-0':
                                            isIncluded,
                                    }
                                )}
                                style={{
                                    gridTemplateColumns: 'min-content 1fr',
                                    gridTemplateRows: 'min-content 1fr',
                                }}
                            >
                                <div className="font-bold text-nowrap self-center">
                                    r/{display_name}
                                </div>
                                <Button
                                    onClick={() => addTopic(display_name)}
                                    disabled={isIncluded}
                                    aria-disabled={isIncluded}
                                    variant="outline"
                                    className="group flex w-fit h-auto px-3 py-1 bg-transparent text-sm rounded-xl border-white"
                                >
                                    <div className="relative w-4 h-4 rounded-full my-auto">
                                        <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 block bg-white group-hover:bg-black w-2.5 h-[2px]"></span>
                                        <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-90 block bg-white group-hover:bg-black w-2.5 h-[2px]"></span>
                                    </div>
                                    add to feed
                                </Button>
                                <div className="col-span-2 max-h-40 border-slate-100 border-2 rounded-md p-1 overflow-hidden">
                                    <div
                                        className="max-h-full overflow-auto flex flex-col"
                                        dangerouslySetInnerHTML={createMarkup(
                                            sanitizeHtml(micromark(description))
                                        )}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SubredditList;
