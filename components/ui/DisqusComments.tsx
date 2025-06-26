// components/DisqusComments.tsx
"use client"; // Important for App Router if this component uses client-side features

import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

interface DisqusCommentsProps {
  url: string;
  identifier: string;
  title: string;
}

const DisqusComments: React.FC<DisqusCommentsProps> = ({ url, identifier, title }) => {
  const disqusShortname = "minhdqdev"; // Replace with your actual Disqus shortname

  const disqusConfig = {
    url: url,
    identifier: identifier,
    title: title,
  };

  return (
    <div className="comments-container">
      <DiscussionEmbed
        shortname={disqusShortname}
        config={disqusConfig}
      />
    </div>
  );
};

export default DisqusComments;