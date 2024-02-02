import React from 'react';

const VideoPlayer = () => {
  return (
    <div>
      <video width="1920" height="1080" controls autoPlay muted >
        <source src="https://nlightnlabs01.s3.us-west-1.amazonaws.com/videos/GenAI+Video.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
