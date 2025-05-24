'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import SubredditList from './subredditList';
import { RedditListingOptions } from '@/reddit';

const entriesPerPage = 25;

type QueryState = {
    page: number;
    listOpts: RedditListingOptions;
};

export default function Manager({
    topics,
    updateTopics,
}: {
    topics: string[];
    updateTopics: (topics: string[]) => void;
}) {
    const [search, setSearch] = useState('');
    const [queryState, setQueryState] = useState<QueryState>({
        page: 1,
        listOpts: {},
    });

    const removeTopic = (topic: string) => {
        updateTopics(topics.filter((t) => t != topic));
    };

    return (
        <>
            <h2 className="text-2xl mb-2">Feed Manager</h2>
            <div className="border-2 border-black rounded-md py-4 px-2">
                <div className="text-xl border-b-2 border-black border-dotted">
                    Active Feeds
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {topics.map((t, i) => (
                        <div
                            key={i}
                            onClick={() => removeTopic(t)}
                            className="relative flex py-1 pl-2 pr-6 group w-fit max-w-96 bg-gray-600 hover:bg-red-800 text-center hover:text-left cursor-pointer rounded-3xl text-white leading-4 transition-all duration-500"
                        >
                            <span className="relative left-2 group-hover:left-0 transition-all duration-500">
                                {t}
                            </span>
                            <div className="absolute right-1 ml-2 w-4 h-4 bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 block bg-white w-3 h-[2px]"></span>
                                <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 -rotate-45 block bg-white w-3 h-[2px]"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4">
                <form
                        className="flex w-fit mx-auto mb-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            const data = new FormData(event.currentTarget);

                            setSearch(data.get('search')?.toString() ?? '');
                        }}
                    >
                        <input
                            name="search"
                            placeholder="search..."
                            className="px-2 rounded-l-xl text-black bg-slate-100"
                        ></input>
                        <Button className="rounded-l-none">Search</Button>
                    </form>
                <SubredditList
                    search={search}
                    userTopics={topics}
                    listingOptions={queryState.listOpts}
                    addTopic={(topic) => updateTopics(topics.concat(topic))}
                    updateOptions={(options) => {
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
                                console.error(
                                    `malformed listing options`,
                                    options
                                );
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
                    }}
                ></SubredditList>
            </div>
        </>
    );
}
