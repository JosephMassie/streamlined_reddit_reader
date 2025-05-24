import TopicContainer from './topicContainer';

export default function Feed({ topics = ['news'] }: { topics?: string[] }) {
    return (
        <div className="flex flex-col mt-4">
            {topics.map((topic, i) => (
                <TopicContainer key={i} subreddit={topic} />
            ))}
        </div>
    );
}
