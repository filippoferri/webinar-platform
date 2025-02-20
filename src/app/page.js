export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500 mb-4">
        Benvenuto alla piattaforma webinar!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Partecipa al nostro prossimo webinar. Registrati ora!
      </p>
      <button className="px-6 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
        Registrati
      </button>
    </div>
  );
}