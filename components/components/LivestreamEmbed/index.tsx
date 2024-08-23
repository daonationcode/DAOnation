const LivestreamEmbed = ({ link }: { link: string }) => {
  return <iframe className="absolute top-0 left-0 w-full h-full rounded-xl" src="https://www.youtube.com/embed/NqRP08sCG_w?autoplay=1&mute=1" title="YouTube Live Stream" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
};

export default LivestreamEmbed;
