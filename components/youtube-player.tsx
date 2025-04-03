interface YouTubePlayerProps {
  videoId: string;
  title: string;
}

const YouTubePlayer = ({ videoId, title }: YouTubePlayerProps) => {
  return (
    <div className="relative w-full aspect-video">
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubePlayer;