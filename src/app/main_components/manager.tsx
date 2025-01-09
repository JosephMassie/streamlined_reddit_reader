'use client';

import { useState } from 'react';
import { LoadingWheel } from './general';
import clsx from 'clsx';
import { micromark } from 'micromark';

import { Button } from '@/components/ui/button';

interface SubRedditData {
    display_name: string;
    description: string;
    type: string;
}

interface RawSubRedditData extends Response {
    data: {
        children: Array<{ data: SubRedditData }>;
    };
}

type ManagerState = 'idle' | 'loading';

export default function Manager({
    topics,
    updateTopics,
}: {
    topics: string[];
    updateTopics: (topics: string[]) => void;
}) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([] as SubRedditData[]);
    const [state, setState] = useState('idle' as ManagerState);

    const removeTopic = (topic: string) => {
        updateTopics(topics.filter((t) => t != topic));
    };

    const getMoreTopics = async (): Promise<SubRedditData[]> => {
        let url = 'https://www.reddit.com/subreddits';

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

    const renderMoreTopics = (newTopics: SubRedditData[]) => {
        return (
            <div className="transition-all flex flex-col">
                {newTopics.map(({ display_name, description, type }, i) => {
                    const isIncluded = topics.includes(display_name);

                    return (
                        <div
                            key={i}
                            className={clsx(
                                'h-full grid auto-rows-min gap-y-2 gap-x-4 rounded-md bg-red-700 text-black leading-4 transition-all overflow-hidden duration-500',
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
                                onClick={() =>
                                    updateTopics(topics.concat(display_name))
                                }
                                disabled={isIncluded}
                                aria-disabled={isIncluded}
                                variant="outline"
                                className="flex w-fit h-auto px-3 py-1 bg-transparent text-sm rounded-xl border-black"
                            >
                                <div className="relative w-4 h-4 rounded-full my-auto">
                                    <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 block bg-black w-2.5 h-[2px]"></span>
                                    <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-90 block bg-black w-2.5 h-[2px]"></span>
                                </div>
                                add to feed
                            </Button>
                            <div className="col-span-2 max-h-40 bg-slate-200 rounded-md p-1 overflow-hidden">
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

    const makeRequest = () => {
        if (state === 'idle') {
            setState('loading');
            getMoreTopics().then((reqResults) => {
                setResults(reqResults);
                setState('idle');
            });
        }
    };

    if (results.length === 0) {
        makeRequest();
    }

    return (
        <>
            <h2 className="text-2xl mb-2">Feed Manager</h2>
            <div className="border-2 rounded-md p-4">
                <div className="text-xl border-b-2 border-dotted">
                    Active Feeds
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {topics.map((t, i) => (
                        <div
                            key={i}
                            onClick={() => removeTopic(t)}
                            className="relative flex py-1 pl-2 pr-6 group w-fit max-w-96 bg-gray-200 hover:bg-gray-400 text-center hover:text-left cursor-pointer rounded-3xl text-black leading-4 transition-all duration-500"
                        >
                            <span className="relative left-2 group-hover:left-0 transition-all duration-500">
                                {t}
                            </span>
                            <div className="absolute right-1 ml-2 w-4 h-4 bg-red-700 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-500">
                                <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 block bg-white w-2.5 h-[2px]"></span>
                                <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 -rotate-45 block bg-white w-2.5 h-[2px]"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-3 rounded-md p-4">
                <form
                    className="flex w-fit mx-auto sm:mx-0 mb-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        makeRequest();
                    }}
                >
                    <input
                        placeholder="search..."
                        onChange={(event) => setSearch(event.target.value)}
                        className="px-2 rounded-l-xl text-black bg-slate-100"
                    ></input>
                    <Button className="rounded-l-none">Search</Button>
                </form>
                {state === 'loading' && <LoadingWheel />}
                {state === 'idle' && results && renderMoreTopics(results)}
            </div>
        </>
    );
}
