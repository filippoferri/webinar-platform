"use client";

import { useState, useEffect } from "react";

export default function PollComponent({ activePopup, closePopup }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [votingDisabled, setVotingDisabled] = useState(false);
  const [results, setResults] = useState(activePopup.results || []);

  useEffect(() => {
    // Automatically show results after 15 seconds
    const votingTimer = setTimeout(() => {
      setVotingDisabled(true);
      setShowResults(true);
    }, 15000);

    // Close popup after results are shown for 15 seconds
    const resultsTimer = setTimeout(() => {
      closePopup();
      setShowResults(false);
    }, 30000); // 15s (Voting) + 15s (Results)

    return () => {
      clearTimeout(votingTimer);
      clearTimeout(resultsTimer);
    };
  }, [activePopup]);

  const handleVote = () => {
    if (!selectedOption || votingDisabled) return;

    setVotingDisabled(true);
    setShowThankYou(true);

    // Automatically switch to results after 15 seconds
    setTimeout(() => {
      setShowThankYou(false);
      setShowResults(true);
    }, 15000);
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-4 text-sm">{activePopup.title}</div>
      <hr className="mb-4" />

      {/* Voting Screen */}
      {!showThankYou && !showResults && (
        <>
          <div className="mt-3 space-y-3">
            {activePopup.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="poll"
                  value={option}
                  className="w-4 h-4"
                  onChange={() => setSelectedOption(option)}
                  disabled={votingDisabled}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
          <hr className="mt-4 mb-4" />
          <div className="flex space-x-2">
            <button
              className="flex-1 px-4 py-2 bg-accent text-white rounded-md"
              onClick={handleVote}
              disabled={!selectedOption || votingDisabled}
            >
              {votingDisabled ? "Voting Closed" : "Vote"}
            </button>
          </div>
        </>
      )}

      {/* Thank You Screen */}
      {showThankYou && <p className="text-center text-gray-700 p-4 text-sm">Thank you for voting!</p>}

      {/* Results Screen */}
      {showResults && (
        <div>
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-sm">{result.text}</p>
                  <p className="text-sm text-gray-600 text-sm">{result.percentage}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                  <div
                    className="bg-accent h-4 rounded-full"
                    style={{ width: `${result.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500">No results available.</p>
          )}
        </div>
      )}
    </div>
  );
}