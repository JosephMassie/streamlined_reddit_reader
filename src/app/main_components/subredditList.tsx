import { HTMLProps } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { micromark } from 'micromark';

import { Button } from '@/components/ui/button';

import { LoadingWheel } from '@/components/loading_wheel';
import { getSubreddits } from '@/apis/reddit';

type SubredditListProps = HTMLProps<HTMLDivElement> & {
    search: string;
    userTopics: string[];
    addTopic: (topic: string) => void;
};

const SubredditList: React.FC<SubredditListProps> = ({
    search,
    userTopics,
    addTopic,
}) => {
    const {
        isLoading,
        isError,
        error,
        data: topicList,
    } = useQuery({
        queryKey: ['topics', search],
        queryFn: () => getSubreddits(search),
    });

    if (isLoading) {
        return <LoadingWheel />;
    }

    if (isError) {
        return (
            <div className="text-3xl">
                Error loading subreddits "{error.toString()}"
            </div>
        );
    }

    return (
        <div className="transition-all flex flex-col">
            {Array.isArray(topicList) &&
                topicList.map(({ display_name, description }, i) => {
                    const isIncluded = userTopics.includes(display_name);

                    return (
                        <div
                            key={`${display_name}_${i}`}
                            className={clsx(
                                'h-full grid auto-rows-min gap-y-2 gap-x-4 rounded-md bg-red-700 text-white leading-4 transition-all overflow-hidden duration-500',
                                {
                                    'max-h-screen p-2 mb-4 last:mb-0':
                                        !isIncluded,
                                    'max-h-0 mb-0 p-0 opacity-0': isIncluded,
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
                                    dangerouslySetInnerHTML={{
                                        __html: micromark(description),
                                    }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default SubredditList;
