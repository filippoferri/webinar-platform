"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Countdown() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos`);
        if (!response.ok) throw new Error("Failed to fetch video data");

        const data = await response.json();
        const selectedVideo = data.find((vid) => vid.id.toString() === videoId);
        if (!selectedVideo) throw new Error("Video ID not found in API");

        setVideo(selectedVideo);

        // Calcola il tempo dell'evento
        const now = new Date();
        const [hours, minutes] = selectedVideo.time.split(":").map(Number);
        const eventTime = new Date();
        eventTime.setHours(hours, minutes, 0, 0);

        // Se l'evento è passato, mostra messaggio invece di countdown
        if (eventTime < now) {
          setTimeLeft(null);
        } else {
          setTimeLeft((eventTime - now) / 1000);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (timeLeft !== null) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push(`/webinar?videoId=${videoId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, router, videoId]);

  if (!video) return <p>Loading...</p>;

  // Funzione per formattare la data in italiano
  const formatDate = (time) => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    return new Date().toLocaleDateString("it-IT", options);
  };

  const formatTime = (time) => {
    return `${video.time}`;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Section: Full-Screen Image */}
      <div className="bg-cover bg-center" style={{ backgroundImage: `url("/images/bg-countdown.jpg")` }}></div>

      {/* Right Section: Content */}
      <div className="flex flex-col justify-center items-start text-left p-10 bg-white">
        <div className="max-w-lg">
          <h1 className="text-3xl font-semibold text-black mt-3">{video.title}: {video.subtitle}</h1>

          <p className="mt-5">
            Ciao! Stiamo per iniziare.
            <br />
            Stiamo solo sistemando le sedie, preparando gli snack 🥐 🍊🧀 e ricontrollando che tutto sia pronto al 100% per te! Riempi il tuo drink e fai quella corsa dell'ultimo minuto in bagno: ci tufferemo insieme tra pochi minuti! :)
          </p>

          <h3 className="mt-6 text-lg font-bold">In questa masterclass, ...</h3>
          <ul className="list-none pl-5 space-y-2 mt-2">
            {video.texts.map((text, index) => (
              <li key={index} className="text-black">
                <span className="text-accent">✔</span> {text}
              </li>
            ))}
          </ul>

          {/* Host Section */}
          <div className="mt-6 flex items-center space-x-4 p-4 border rounded-lg bg-gray-100 w-full">
            <img
              src="/images/profile-pic.png"
              alt="Filippo Ferri"
              className="w-14 h-14 rounded-full"
            />
            <div>
              <p className="text-lg font-bold text-black">Filippo Ferri</p>
              <p className="text-sm text-gray-600">Career Strategist + Success Coach</p>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer - Full Width */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-6 rounded-t-lg bg-opacity-70">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">

          {/* Event Date (Right Side) */}
          <div>
            <p className="text-xl capitalize">{formatDate(video.time)}</p>
            <p className="text-lg">Alle ore {formatTime(video.time)}</p>
          </div>

          {/* Countdown Timer (Left Side) */}
          <div className="flex flex-col items-center">
            <div className="text-sm uppercase text-white mb-1 text-center font-bold">Inizia tra...</div>
            {timeLeft !== null ? (
              <div className="flex space-x-4 text-center">
                <div className="text-2xl text-highlight font-bold">
                  {Math.floor(timeLeft / 86400)} <span className="block text-sm text-white uppercase">Giorni</span>
                </div>
                <div className="text-2xl text-highlight font-bold">
                  {Math.floor((timeLeft % 86400) / 3600)} <span className="block text-sm text-white uppercase">Ore</span>
                </div>
                <div className="text-2xl text-highlight font-bold">
                  {Math.floor((timeLeft % 3600) / 60)} <span className="block text-sm text-white uppercase">Minuti</span>
                </div>
                <div className="text-2xl text-highlight font-bold">
                  {Math.floor(timeLeft % 60)} <span className="block text-sm text-white uppercase">Secondi</span>
                </div>
              </div>
            ) : (
              <p className="text-red-500 font-bold">Evento terminato</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}