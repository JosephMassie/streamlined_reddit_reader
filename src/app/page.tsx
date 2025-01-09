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
                <div className="z-10 sticky top-1 sm:top-0 sm:relative">
                    <div className="sm:sticky top-2 flex sm:flex-col bg-gray-600 p-4 rounded-xl shadow-2xl">
                        <Button
                            onClick={() => setState('view')}
                            className="mx-auto sm:mb-4 min-w-[100px]"
                        >
                            View Feed
                        </Button>
                        <Button
                            onClick={() => setState('manage')}
                            className="mx-auto min-w-[100px]"
                        >
                            Manage Feed
                        </Button>
                    </div>
                </div>
                <div className="relative p-4 sm:px-8">
                    {state === 'view' && <Feed topics={topics} />}
                    {state === 'manage' && (
                        <Manager topics={topics} updateTopics={updateTopics} />
                    )}
                </div>
            </div>
        </main>
    );
}
