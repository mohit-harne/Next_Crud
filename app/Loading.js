// components/Loading.js
import React from 'react';
import { Circles } from 'react-loader-spinner'; // or any loader you prefer

const Loading = () => {
  return (
    <div className="loading-overlay">
      <Circles color="#00BFFF" height={80} width={80} />
      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.8);
          z-index: 9999;
        }
      `}</style>
    </div>
  );
};

export default Loading;
