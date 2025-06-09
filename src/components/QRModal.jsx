'use client'; // if you're using Next 13+ with app router

import React, { useState } from 'react';
import { QRCodeCanvas  } from 'qrcode.react';

const QRModal = ({ onClose, qrValue }) => {
  return (
    <div className="absolute inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center">
      <div className="relative bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md flex flex-col items-center shadow-lg space-y-4">

        {/* Close Icon Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
  
        <h2 className="text-xl font-semibold text-center">Connect Your Identity</h2>
  
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Please, scan this QR code with the <strong>Privado ID</strong> wallet mobile app.
        </p>
  
        {/* <div className="p-4 border border-gray-200 dark:border-neutral-700 rounded-lg">
          <QRCodeCanvas value={"qrValue"} size={300} />
        </div> */}
        <div className="p-4 border border-gray-200 dark:border-neutral-700 rounded-lg bg-white">
  <QRCodeCanvas value={qrValue.web} size={200} />
</div>
  
        <p className="text-sm font-medium text-center mt-2 dark:text-white">
          Scan and Connect for Sign In
        </p>
  
        <p className="text-sm text-gray-600 text-center dark:text-gray-400">
          Don’t have Mobile Wallet? Try Using{' '}
          <a href={qrValue.web} className="text-blue-600 hover:underline font-medium">
            Web Wallet
          </a>.
        </p>
  
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue with Web
        </button>
      </div>
    </div>
  );
  
};

export default QRModal;
