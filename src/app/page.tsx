'use client';

import { useEffect, useState } from 'react';
import Feed from './main_components/feed';
import Manager from './main_components/manager';
import { Button } from '@/components/ui/button';

type AppState = 'view' | 'manage';

export default function Home() {
    const [state, setState] = useState('manage' as AppState);
    const [topics, setTopics] = useState(['news']);

    const packTopics = (t: string[]) => t.sort().join(',');
    const unpackTopics = (t: string) => t.split(',');

    const storageKey = 'srr_feed';
    const storage = typeof window !== 'undefined' ? localStorage : null;

    useEffect(() => {
        const savedTopics = storage && storage.getItem(storageKey);

        if (savedTopics && savedTopics !== packTopics(topics)) {
            setTopics(unpackTopics(savedTopics));
        }
    });

    const updateTopics = (t: string[]) => {
        if (storage) storage.setItem(storageKey, packTopics(t));
        setTopics(t);
    };

    return (
        <main
            role="main"
            className="h-screen overflow-y-auto bg-gray-400 m-0 text-black px-1 sm:px-[15px]"
        >
            <div
                className="relative sm:container min-h-[500px] my-4 mx-auto flex flex-col sm:grid gap-y-2 sm:gap-y-[20px]"
                style={{
                    gridTemplateColumns: '20% 80%',
                    gridTemplateRows: 'min-content',
                }}
            >
                <div className="col-span-2 mb-6 sm:mb-0">
                    <h1 className="text-center text-3xl">
                        Streamlined Reddit Reader
                    </h1>
                </div>
                <div className="z-10 sticky top-1 sm:top-0 sm:relative bg-gray-600 p-4 rounded-xl sm:rounded-r-none sm:rounded-l-xl shadow-2xl">
                    <div className="sm:sticky top-2 flex sm:flex-col">
                        <Button
                            onClick={() => setState('view')}
                            className="mx-auto sm:mb-4 min-w-[100px]"
                        >
                            Feed
                        </Button>
                        <Button
                            onClick={() => setState('manage')}
                            className="mx-auto min-w-[100px]"
                        >
                            Manage
                        </Button>
                    </div>
                </div>
                <div className="relative bg-gray-800 text-white rounded-xl sm:rounded-l-none sm:rounded-r-xl p-4">
                    {state === 'view' && <Feed topics={topics} />}
                    {state === 'manage' && (
                        <Manager topics={topics} updateTopics={updateTopics} />
                    )}
                </div>
            </div>
        </main>
    );
}
