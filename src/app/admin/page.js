"use client";

import { useState, useEffect, useCallback } from "react";
import JsonEditor from "../components/JsonEditor";

export default function Admin() {
  const sampleJson = `[
    {
      "time": 5,
      "type": "poll",
      "title": "What is your biggest challenge?",
      "content": "Choose one:",
      "options": ["User retention", "Conversion rates", "User engagement"],
      "results": [
        { "text": "User retention", "percentage": 40 },
        { "text": "Conversion rates", "percentage": 35 },
        { "text": "User engagement", "percentage": 25 }
      ]
    },
    {
      "time": 40,
      "duration": 20,
      "type": "offer",
      "title": "🔥 Exclusive Deal!",
      "content": "https://placehold.co/600x400",
      "cta": "Get the Deal",
      "link": "#"
    }
  ]`;

  const [videos, setVideos] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoDetails, setVideoDetails] = useState({
    link: "",
    title: "",
    subtitle: "",
    image: "",
    time: "",
    duration: "",
    actionGuide: "",
    texts: [""],
    popups: sampleJson,
  });

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/videos");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to fetch webinars. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name}:`, { 
      previousValue: videoDetails[name], 
      newValue: value 
    });
    setVideoDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleTextChange = (index, value) => {
    const updatedTexts = [...videoDetails.texts];
    updatedTexts[index] = value;
    setVideoDetails(prev => ({ ...prev, texts: updatedTexts }));
  };

  const addTextField = () => {
    if (videoDetails.texts.length < 5) {
      setVideoDetails(prev => ({ ...prev, texts: [...prev.texts, ""] }));
    }
  };

  const removeTextField = (index) => {
    const updatedTexts = videoDetails.texts.filter((_, i) => i !== index);
    setVideoDetails(prev => ({ ...prev, texts: updatedTexts }));
  };

  const handleJsonChange = (value) => {
    setVideoDetails(prev => ({ ...prev, popups: value }));
  };

  const handleAddOrEditVideo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let parsedPopups;
      try {
        parsedPopups = JSON.parse(videoDetails.popups);
      } catch (jsonError) {
        throw new Error("Invalid JSON format. Please check your input.");
      }

      const videoData = {
        ...videoDetails,
        duration: parseInt(videoDetails.duration, 10),
        popups: parsedPopups,
      };

      const method = editMode ? "PUT" : "POST";
      const response = await fetch("/api/videos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMode ? { id: editingVideoId, ...videoData } : videoData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      resetForm();
      fetchVideos();
    } catch (error) {
      console.error("Error saving video:", error);
      setError(error.message || "Failed to save webinar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (video) => {
    setEditMode(true);
    setEditingVideoId(video.id);
    setVideoDetails({
      ...video,
      popups: JSON.stringify(video.popups, null, 2),
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      setError("Failed to delete webinar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setVideoDetails({
      link: "",
      title: "",
      subtitle: "",
      image: "",
      time: "",
      duration: "",
      actionGuide: "",
      texts: [""],
      popups: sampleJson,
    });
    setIsFormVisible(false);
    setEditMode(false);
    setEditingVideoId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-8">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Area</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!isFormVisible ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Webinars</h2>
              <button 
                onClick={() => setIsFormVisible(true)} 
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600"
              >
                + Add Webinar
              </button>
            </div>
            
            {videos.length > 0 ? (
              <ul className="space-y-4">
                {videos.map((video) => (
                  <li
                    key={video.id}
                    className="p-4 bg-gray-100 rounded-md flex justify-between items-center"
                  >
                    <div className="w-1/3 flex flex-col">
                      <p className="text-lg font-bold">{video.title}</p>
                      <p className="text-sm text-gray-600">Scheduled Time: {video.time}</p>
                    </div>

                    <div className="w-1/3 flex items-center justify-center  space-x-4">
                      {/* Join Page Link */}
                      <a
                        href={`/join?videoId=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        aria-label="Open Join Page"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-6 h-6"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H18" />
                        </svg>
                      </a>

                      {/* Countdown Page Link */}
                      <a
                        href={`/countdown?videoId=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
                        aria-label="Open Countdown Page"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-6 h-6"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </a>

                      {/* Webinar Page Link */}
                      <a
                        href={`/webinar?videoId=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                        aria-label="Open Webinar Page"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-6 h-6"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                        </svg>
                      </a>
                    </div>

                    <div className="w-1/3 flex items-center justify-end space-x-4">


                      {/* Edit Video */}
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                        aria-label="Edit Video"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-6 h-6"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>

                      {/* Delete Video */}
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600"
                        aria-label="Delete Video"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-6 h-6"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mt-4">No webinars added yet.</p>
            )}
          </>
        ) : (
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editMode ? "Edit Webinar" : "Add New Webinar"}
            </h2>
            <form onSubmit={handleAddOrEditVideo}>
              <input 
                type="text" 
                name="title" 
                value={videoDetails.title} 
                onChange={handleChange} 
                placeholder="Title" 
                className="w-full mb-4 p-2 border rounded-md" 
                required 
              />
              <input 
                type="text" 
                name="subtitle" 
                value={videoDetails.subtitle} 
                onChange={handleChange} 
                placeholder="Subtitle" 
                className="w-full mb-4 p-2 border rounded-md" 
                required 
              />
              <input 
                type="text" 
                name="link" 
                value={videoDetails.link} 
                onChange={handleChange} 
                placeholder="Video Link" 
                className="w-full mb-4 p-2 border rounded-md" 
                required 
              />
              <input 
                type="text" 
                name="image" 
                value={videoDetails.image} 
                onChange={handleChange} 
                placeholder="Image Link" 
                className="w-full mb-4 p-2 border rounded-md" 
                required 
              />
              <input 
                type="time" 
                name="time" 
                value={videoDetails.time} 
                onChange={handleChange} 
                className="w-full mb-4 p-2 border rounded-md" 
                required 
              />
              <input 
                type="number" 
                name="duration" 
                value={videoDetails.duration} 
                onChange={handleChange} 
                placeholder="Duration (seconds)" 
                className="w-full mb-4 p-2 border rounded-md" 
                required 
              />
              <input 
                type="text" 
                name="actionGuide" 
                value={videoDetails.actionGuide} 
                onChange={handleChange} 
                placeholder="Action Guide" 
                className="w-full mb-4 p-2 border rounded-md" 
                required 
              />

              <JsonEditor 
                value={videoDetails.popups} 
                onChange={handleJsonChange} 
              />

              <div className="mb-4">
                <label className="text-gray-800 font-bold mb-2 block">
                  You'll learn:
                </label>
                {videoDetails.texts.map((text, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input 
                      type="text" 
                      value={text} 
                      onChange={(e) => handleTextChange(index, e.target.value)} 
                      placeholder={`Benefit ${index + 1}`} 
                      className="flex-1 p-2 border rounded-md mr-2" 
                      required 
                    />
                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => removeTextField(index)} 
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {videoDetails.texts.length < 5 && (
                  <button 
                    type="button" 
                    onClick={addTextField} 
                    className="bg-green-500 text-white p-2 rounded-md mt-2"
                  >
                    Add Benefit
                  </button>
                )}
              </div>

              <div className="flex justify-between">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600"
                  disabled={isLoading}
                >
                  {editMode ? "Update Webinar" : "Add Webinar"}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}