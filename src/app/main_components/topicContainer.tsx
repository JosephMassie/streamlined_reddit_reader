import { getPots } from '@/apis/reddit';
import ErrorMsg from '@/components/errorMsg';
import { LoadingWheel } from '@/components/loading_wheel';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { RedditListingOptions } from '@/reddit';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { HTMLProps, useState } from 'react';
import Post from './post';
import { Button } from '@/components/ui/button';

type MainContainerProps = HTMLProps<HTMLDivElement> & {
    subreddit: string;
};

const MainContainer: React.FC<MainContainerProps> = ({
    children,
    subreddit,
}) => {
    return (
        <Collapsible
            className="relative p-4 bg-gray-800 rounded-xl"
            defaultOpen={true}
        >
            <CollapsibleTrigger className="flex w-full hover:italic">
                <h2 className="text-left text-4xl text-white font-bold">
                    r/{subreddit}
                </h2>
                <ChevronDown className="ml-auto mr-0 w-10 h-10 text-white" />
            </CollapsibleTrigger>
            <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
    );
};

type TopicContainerProps = HTMLProps<HTMLDivElement> & {
    subreddit: string;
};

type QueryState = {
    page: number;
    listOpts: RedditListingOptions;
};

const entriesPerPage = 25;

const TopicContainer: React.FC<TopicContainerProps> = ({ subreddit }) => {
    const [queryState, setQueryState] = useState<QueryState>({
        page: 1,
        listOpts: {},
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

    const { isLoading, isError, error, data } = useQuery({
        queryKey: [subreddit, JSON.stringify(queryState.listOpts)],
        queryFn: () => getPots(subreddit, queryState.listOpts),
    });

    if (isLoading) {
        return (
            <MainContainer subreddit={subreddit}>
                <LoadingWheel />
            </MainContainer>
        );
    }

    if (isError) {
        return (
            <MainContainer subreddit={subreddit}>
                <ErrorMsg msg={error.toString()} />
            </MainContainer>
        );
    }

    return (
        <MainContainer subreddit={subreddit}>
            <div className="md:sticky top-0 bg-gray-800 p-2 z-10 flex justify-end gap-2">
                {data?.before && (
                    <Button
                        onClick={() => {
                            updateOptions({
                                before: data.before,
                                after: null,
                            });
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
            <div className="mt-2 flex flex-col gap-6">
                {data?.children.map(({ data: postData }, i) => (
                    <Post key={i} data={postData} />
                ))}
            </div>
        </MainContainer>
    );
};

export default TopicContainer;
