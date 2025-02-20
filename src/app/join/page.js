"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Join() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId"); // Get videoId from the URL
  const [video, setVideo] = useState(null); // Stores the video data
  const [showPopup, setShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [selectedOption, setSelectedOption] = useState(null); // Tracks selected option
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const router = useRouter(); // For navigation

  const togglePopup = () => setShowPopup(!showPopup);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos`);
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }
        const data = await response.json();
        const selectedVideo = data.find((vid) => vid.id.toString() === videoId);
        setVideo(selectedVideo);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      alert("Seleziona una data.");
      return;
    }

    try {
      // Registra l'utente su SendFox
      await fetch("https://api.sendfox.com/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.SENDFOX_AUTHORIZATION_CODE
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.name,
          lists: [559076],
        }),
      });

      // Se ha selezionato "Ieri", lo mando subito al webinar
      if (selectedOption === "yesterday") {
        router.push(`/webinar?videoId=${videoId}`);
      } else {
        // Invia l'email con il link countdown
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            countdownUrl: `/countdown?videoId=${videoId}&name=${encodeURIComponent(formData.name)}`,
          }),
        });

        // Reindirizza alla pagina di successo
        router.push(`/success?videoId=${videoId}`);
      }
    } catch (error) {
      console.error("Errore nella registrazione:", error);
      alert("Errore! Riprova.");
    }
  };

  if (!video) {
    return <p>Sto caricando la pagina...</p>; // Show a loading state while fetching data
  }

  // Calculate event dates and times based on video time
  const now = new Date();
  const videoDate = new Date(); // Use today's date with video time
  const [hours, minutes] = video.time.split(":").map(Number);
  videoDate.setHours(hours, minutes, 0, 0);

  const tomorrowDate = new Date(videoDate); // Calculate tomorrow's date
  tomorrowDate.setDate(videoDate.getDate() + 1);

  // Filter past events
  const options = [
    {
      id: "yesterday",
      label: "Guarda ora la registrazione di ieri",
      subtitle: "Inizia immediatamente",
      valid: true, // Always show yesterday's option
    },
    {
      id: "today",
      label: `Oggi alle ${videoDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      subtitle: `Inizia tra ${Math.max(Math.ceil((videoDate - now) / 1000 / 60), 0)} minuti`,
      valid: videoDate > now, // Show only if the event hasn't passed
    },
    {
      id: "tomorrow",
      label: `Domani alle ${tomorrowDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      subtitle: `Inizia tra ${Math.max(Math.ceil((tomorrowDate - now) / 1000 / 60 / 60), 0)} ore`,
      valid: true, // Always show tomorrow's option
    },
  ].filter((option) => option.valid); // Remove invalid options

  return (
    <div className="min-h-screen flex items-center justify-center bg-join-page bg-cover bg-center">
      <div className="max-w-7xl w-full px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column */}
        <div>
          <img src={video.image} alt={video.title} className="w-full" />
        </div>

        {/* Right Column */}
        <div>
          <h1 className="text-5xl font-headings text-black mb-4">{video.title}</h1>
          <h2 className="text-l text-black mb-6">{video.subtitle}</h2>
          <hr />
          <h3 className="mb-4 mt-8">In questa masterclass, imparerai:</h3>
          <ul className="list-none pl-5 space-y-2 mb-8">
            {(video.texts || []).map((text, index) => (
              <li key={index} className="text-black">
                <span className="text-accent">✔</span> {text}
              </li>
            ))}
          </ul>
          <button
            onClick={togglePopup}
            className="px-6 py-3 button mb-8"
          >
            UNISCITI ALLA MASTERCLASS!
          </button>
          <p className="text-sm text-black">
            Prendo molto seriamente la tua privacy<br /> e non condividerò mai le tue informazioni.
          </p>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative">
            {/* Popup Header */}
            <div className="bg-accent text-white p-6 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">Filippo Ferri</h2>
              <button
                onClick={togglePopup}
                className="text-white text-xl font-bold focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">

              <h3 className="mt-4 mb-8 font-bold text-center text-2xl">
                {video.title}: {video.subtitle}
              </h3>

              <form onSubmit={handleRegister}>
                {/* Custom Dropdown */}
                <div className="mb-6 mt-4 relative">
                  <div
                    className="border rounded-md px-4 py-3 cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    {selectedOption ? (
                      <span>{selectedOption}</span>
                    ) : (
                      "Seleziona la data..."
                    )}
                  </div>

                  {/* Dropdown Options */}
                  {showDropdown && (
                    <div className="absolute bg-white border rounded-md mt-2 w-full shadow-lg z-10">
                      {options.map((option) => (
                        <div
                          key={option.id}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedOption(option.label);
                            setShowDropdown(false);
                          }}
                        >
                          <p className="font-bold">{option.label}</p>
                          <p className="text-sm text-gray-500">{option.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="mb-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full border rounded-md px-4 py-3"
                    placeholder="Inserisci il tuo nome"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full border rounded-md px-4 py-3"
                    placeholder="Inserisci la tua email"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-3 button"
                  >
                    Registrati adesso
                  </button>
                </div>
              </form>
              <p className="text-sm text-black mt-8">
                I tuoi dati saranno inoltrati all'organizzatore del webinar, che potrebbe comunicare con te in merito a questo evento o ai suoi servizi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}