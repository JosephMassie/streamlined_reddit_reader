import TopicContainer from './topicContainer';

export default function Feed({ topics = ['news'] }: { topics?: string[] }) {
    return (
        <div className="flex flex-col gap-5">
            {topics.map((topic, i) => (
                <TopicContainer key={i} subreddit={topic} />
            ))}
        </div>
    );
}
