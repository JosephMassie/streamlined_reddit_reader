import { LoadingWheel } from '@/components/loading_wheel';

import { ChevronsUpDown } from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useQuery } from '@tanstack/react-query';

import { loadFeed } from '@/apis/reddit';

import Post from './post';
import ErrorMsg from '@/components/errorMsg';

export default function Feed({ topics = ['news'] }: { topics?: string[] }) {
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['feed'],
        queryFn: () => loadFeed(topics),
    });

    if (isPending) {
        return <LoadingWheel />;
    }

    if (isError) {
        return (
            <ErrorMsg
                msg={`Error Occured requesting feed "${error.toString()}"`}
            />
        );
    }

    return (
        <div className="flex flex-col mt-4">
            {Object.keys(data).map((topic, i) => (
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
                            {data[topic].children.map(
                                ({ data: postData }, i) => (
                                    <Post key={i} data={postData} />
                                )
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    );
}
