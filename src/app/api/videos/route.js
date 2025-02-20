let videos = []; // In-memory storage for videos

export async function GET() {
  // Fetch all videos
  return new Response(JSON.stringify(videos), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  // Add a new video
  const newVideo = await request.json();
  newVideo.id = Date.now(); // Assign a unique ID
  videos.push(newVideo);

  return new Response(JSON.stringify({ message: "Video added successfully!" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request) {
  // Update an existing video
  const updatedVideo = await request.json();
  const index = videos.findIndex((video) => video.id === updatedVideo.id);

  if (index === -1) {
    return new Response(JSON.stringify({ message: "Video not found!" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  videos[index] = updatedVideo;

  return new Response(JSON.stringify({ message: "Video updated successfully!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request) {
  // Delete a video
  const { id } = await request.json();
  const index = videos.findIndex((video) => video.id === id);

  if (index === -1) {
    return new Response(JSON.stringify({ message: "Video not found!" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  videos.splice(index, 1);

  return new Response(JSON.stringify({ message: "Video deleted successfully!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}