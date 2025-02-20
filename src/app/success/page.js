"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Success() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos`);
        if (!response.ok) throw new Error("Failed to fetch video data");

        const data = await response.json();
        const selectedVideo = data.find((vid) => vid.id.toString() === videoId);
        setVideo(selectedVideo);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      {/* Hero Section */}
      <div className="relative h-[200px] flex flex-col items-center justify-center text-center bg-[#313131] hero-arrow--bottom">
        <style jsx>{`
          .hero-arrow--bottom {
            position: relative;
          }
          .hero-arrow--bottom::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            border-color: #313131 transparent transparent transparent;
            border-width: 18px 30px 0;
            left: 50%;
            top: 100%;
            transform: translateX(-50%);
          }
        `}</style>
        <div>
          <h1 className="text-4xl md:text-6xl text-white mb-6 mt-4">
            Congratulazioni!
          </h1>
          <p className="text-xl md:text-2xl text-white">
            Il tuo posto per la masterclass <b>{video?.title}</b> è stato riservato con successo
          </p>
        </div>
      </div>

      {/* Main Content Section - Fills remaining height */}
      <div className="flex-grow flex items-center bg-[url(/images/bg-success.png)] bg-cover bg-center-top bg-no-repeat">
        <div className="max-w-7xl mx-auto px-4 w-full sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image (hidden on mobile) */}
            <div className="relative h-full hidden md:block"></div>

            {/* Right Column - Content */}
            <div className="max-w-lg mx-auto md:mx-0">
              <p className="mb-8 text-black">
                Controlla la tua casella di posta elettronica. Il link per partecipare alla masterclass arriverà tra pochi istanti!
              </p>

              <h2 className="text-xl font-bold text-black mb-6">
                IMPORTANTE: Scarica la tua Action Guide!
              </h2>
              <div className="space-y-4 text-black">
                <p>
                  Per sfruttare al meglio la masterclass, clicca sul pulsante qui sotto e scarica la guida pratica.
                </p>
                
                <button 
                  onClick={() => video?.actionGuide && window.open(video.actionGuide, '_blank')}
                  className="mt-8 bg-accent text-white px-8 py-4 rounded-lg font-semibold w-full md:w-auto"
                >
                  Scarica la Action Guide
                </button>

                <p className="text-lg">
                  La guida ti aiuterà a:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Massimizzare l'apprendimento durante il webinar</li>
                  <li>Implementare le strategie discusse</li>
                  <li>Ottenere risultati concreti</li>
                  <li>Trasformare la teoria in pratica</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}