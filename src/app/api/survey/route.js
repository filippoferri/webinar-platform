let surveyResponses = []; // Memorizza le risposte temporaneamente (puoi connetterlo a un DB)

export async function POST(req) {
  try {
    const { selectedOptions } = await req.json();

    if (!selectedOptions || !Array.isArray(selectedOptions)) {
      return new Response(
        JSON.stringify({ error: "Invalid data format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Salva i dati in memoria
    surveyResponses.push({ selectedOptions, timestamp: new Date().toISOString() });

    return new Response(
      JSON.stringify({ message: "Survey response saved successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Survey API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}