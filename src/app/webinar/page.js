"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import PollComponent from "../components/PollComponent";
import OfferComponent from "../components/OfferComponent";

export default function Webinar() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const [video, setVideo] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("0");
  const [videoDuration, setVideoDuration] = useState(null);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState("chat");
  const [popups, setPopups] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos`);
        if (!response.ok) throw new Error("Failed to fetch video data");
  
        const data = await response.json();
        const selectedVideo = data.find((vid) => vid.id.toString() === videoId);
        if (!selectedVideo) throw new Error("Video ID not found in API");
  
        setVideo(selectedVideo);
        setVideoDuration(selectedVideo.duration);
  
        // Ensure popups is always an array
        setPopups(Array.isArray(selectedVideo.popups) ? selectedVideo.popups : []);
  
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
  
    if (videoId) fetchVideo();
  }, [videoId]);

  const handleStartVideo = () => {
    setShowOverlay(false);
    setIsLive(true);
    setElapsedTime(0);
  
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          console.warn("Autoplay was blocked by the browser.");
        });
      }
    }, 500);
  
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= videoDuration) {
          clearInterval(timerRef.current);
          return videoDuration;
        }
  
        // Ensure popups is an array before accessing it
        if (Array.isArray(popups) && popups.length > 0) {
          const popupToShow = popups.find(p => Math.floor(p.time) === prev);
  
          if (popupToShow) {
            setActivePopup(popupToShow);
  
            if (popupToShow.type === "poll") {
              // Show results after 15 seconds
              setTimeout(() => {
                setShowResults(true);
              }, 15000);
  
              // Close popup only after results have been shown for 10 seconds
              setTimeout(() => {
                setActivePopup(null);
                setShowResults(false);
              }, 25000);
            } else {
              // For non-poll popups (e.g., offers), close after 15 seconds
              setTimeout(() => {
                setActivePopup(null);
              }, 15000);
            }
          }
        }
  
        return Math.floor(prev + 1);
      });
    }, 1000);
  };

  const handleVideoEnd = () => {
    clearInterval(timerRef.current);
    setShowThankYou(true);
  };

  const handleVote = () => {
    if (!selectedOption) return;
    setShowThankYou(true);
  
    // After 15 seconds, show poll results
    setTimeout(() => {
      setShowThankYou(false);
      setShowResults(true);
  
      // After 10 seconds, remove results
      setTimeout(() => {
        setActivePopup(null);
        setShowResults(false);
      }, 10000);
    }, 15000);
  };

  const formatTime = (seconds) => {
    const totalSeconds = Math.floor(seconds); // Ensure whole number
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gray-dark">
      {/* Left Section */}
      <div className="flex-1 flex justify-center items-center p-10 relative">
        {!showThankYou ? (
          <video
            ref={videoRef}
            src={video.link}
            onEnded={handleVideoEnd}
            className="w-full h-auto rounded-lg object-cover"
            tabIndex="-1"
            disablePictureInPicture
          />
        ) : (
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold">Grazie per aver partecipato! 🎉</h2>
            <p className="mt-2 text-lg">Lascia una valutazione per aiutarmi a migliorare.</p>
            <div className="mt-4 flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-4xl ${
                    rating >= star ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {showOverlay && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
            onClick={handleStartVideo}
            style={{ width: "100%", height: "100%" }}
          >
            <img
              src="/images/placeholder.jpg"
              alt="Play"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Sidebar Container with Dark Background */}
      <div className="w-[400px] bg-gray-dark p-4 flex flex-col">
        {/* Inner White Section */}
        <div className="w-full h-full bg-white flex flex-col rounded-lg overflow-hidden">
          {/* Timer */}
          <div className="h-[77px] flex items-center justify-center bg-gray-100 text-xl border-b">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="ml-2 w-[55px]">{formatTime(elapsedTime)}</span>
          </div>

          {/* Tabs (Chat & Q&A) */}
          <div className="flex border-b">
            <button
              className={`w-1/2 py-3 text-center ${
                activeTab === "chat" ? "font-bold border-b-2 border-accent" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </button>
            <button
              className={`w-1/2 py-3 text-center ${
                activeTab === "qna" ? "font-bold border-b-2 border-accent" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("qna")}
            >
              Q&A
            </button>
          </div>

          {/* Chat/Q&A Content */}
          <div className="flex-1 overflow-y-auto p-4 relative">

            <div className="bg-[#fff6b4] rounded-lg p-4 mb-3 text-sm"> 
            Benvenuti, questo webinar è una replica. Se hai una domanda, invia un commento e arriverà nella mia casella di posta. Buon divertimento!
            </div>

            {activeTab === "chat" ? (
              <p className="text-gray-500 text-sm">Inizia la conversazione...</p>
            ) : (
              <p className="text-gray-500 text-sm">Fai una domanda...</p>
            )}

            {/* Interactive Popover */}
            {activePopup && (
            <div className="absolute bg-[#f1f3f4] bottom-[15px] left-[15px] right-[15px] w-[calc(100%-30px)] rounded-lg p-4">
              {activePopup.type === "offer" ? (
                <OfferComponent 
                  activePopup={activePopup} 
                  closePopup={() => setActivePopup(null)} 
                />
              ) : (
                <PollComponent
                  activePopup={{ ...activePopup, results: activePopup.results || [] }}
                  closePopup={() => setActivePopup(null)}
                />
              )}
            </div>
          )}  

          </div>

          {/* Chat Input */}
          <div className="h-[60px] flex items-center border-t px-4 bg-[#f1f3f4] rounded-[25px] mx-[15px] mb-[15px]">
            <input
              type="text"
              placeholder="Scrivi la tua domanda qui..."
              value={chatMessage} // Bind state
              onChange={(e) => setChatMessage(e.target.value)} // Update state on change
              className="flex-1 bg-transparent outline-none text-black"
            />            
            <button
              onClick={() => {
                if (chatMessage.trim() !== "") {
                  // Here you can add logic to actually send the message
                  console.log("Messaggio inviato:", chatMessage);
                  setChatMessage(""); // Clear input field
                }
              }}
              className="ml-2 text-black font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}