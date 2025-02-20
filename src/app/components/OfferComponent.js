    "use client";

    import { useState, useEffect } from "react";

    export default function OfferComponent({ activePopup, closePopup }) {
    const [timeRemaining, setTimeRemaining] = useState(activePopup.duration || 20);

    useEffect(() => {
        // If duration is provided, create a countdown
        if (activePopup.duration) {
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
            if (prev <= 1) {
                clearInterval(timer);
                closePopup();
                return 0;
            }
            return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        }
    }, [activePopup.duration, closePopup]);

    return (
        <div className="bg-white rounded-lg p-4 relative">
        {/* Optional Title */}
        {activePopup.title && (
            <h3 className="font-bold text-lg mb-3 text-center">{activePopup.title}</h3>
        )}

        {/* Offer Content */}
        <div className="flex flex-col items-center">
            {/* Image or Content */}
            <img 
            src={activePopup.content} 
            alt="Exclusive Offer" 
            className="max-w-full rounded-md mb-4"
            />

            {/* Call to Action */}
            {activePopup.cta && (
            <a 
                href={activePopup.link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-accent w-full text-white rounded-md hover:bg-opacity-90 transition-colors text-center"
            >
                {activePopup.cta}
            </a>
            )}
        </div>
        </div>
    );
    }