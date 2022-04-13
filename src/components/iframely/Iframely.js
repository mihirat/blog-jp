import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const Iframely = () => {
  useEffect(() => {
    if (window && window.iframely) {
      window.iframely.load();
    }
  }, []);

  return (
    <Helmet>
      <script async src="https://cdn.iframe.ly/embed.js" charset="utf-8"></script>
    </Helmet>
  );
};

export default Iframely;