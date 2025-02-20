import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const videos = await prisma.video.findMany()
    return NextResponse.json(videos, { status: 200 })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch videos', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const videoData = await request.json()
    
    // Ensure texts and popups are stringified if they're arrays/objects
    const processedData = {
      ...videoData,
      texts: Array.isArray(videoData.texts) 
        ? JSON.stringify(videoData.texts) 
        : videoData.texts,
      popups: typeof videoData.popups === 'object' 
        ? JSON.stringify(videoData.popups) 
        : videoData.popups
    }

    const video = await prisma.video.create({
      data: processedData
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create video', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const videoData = await request.json()
    
    // Ensure texts and popups are stringified if they're arrays/objects
    const processedData = {
      ...videoData,
      texts: Array.isArray(videoData.texts) 
        ? JSON.stringify(videoData.texts) 
        : videoData.texts,
      popups: typeof videoData.popups === 'object' 
        ? JSON.stringify(videoData.popups) 
        : videoData.popups
    }

    const video = await prisma.video.update({
      where: { id: videoData.id },
      data: processedData
    })

    return NextResponse.json(video, { status: 200 })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to update video', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    
    const video = await prisma.video.delete({
      where: { id }
    })

    return NextResponse.json(video, { status: 200 })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete video', 
      details: error.message 
    }, { status: 500 })
  }
}