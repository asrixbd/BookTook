"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file || !title) return alert("Please provide a title and a PDF file!")
    
    // Security Check: Only allow PDFs
    if (file.type !== "application/pdf") {
      return alert("Only PDF files are allowed! No spooks allowed.")
    }

    setLoading(true)

    // 1. Upload PDF to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { data: storageData, error: storageError } = await supabase.storage
      .from('pdfs')
      .upload(fileName, file)

    if (storageError) {
      alert("Storage Error: " + storageError.message)
      setLoading(false)
      return
    }

    // 2. Save Book Metadata to Database
    const { error: dbError } = await supabase.from('books').insert([
      { 
        title, 
        author, 
        description, 
        file_url: fileName 
      }
    ])

    if (dbError) {
      alert("Database Error: " + dbError.message)
    } else {
      alert("Book uploaded successfully to BookTook!")
      window.location.href = "/" // Redirect to home
    }
    
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-xl mt-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Upload to BookTook</h1>
      <div className="flex flex-col gap-4">
        <input type="text" placeholder="Book Title" className="border p-2 rounded text-black" onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Author Name" className="border p-2 rounded text-black" onChange={(e) => setAuthor(e.target.value)} />
        <textarea placeholder="Brief Description" className="border p-2 rounded text-black" onChange={(e) => setDescription(e.target.value)} />
        <label className="text-sm text-gray-600">Select PDF File:</label>
        <input type="file" accept=".pdf" className="border p-2 text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button 
          onClick={handleUpload} 
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload Book"}
        </button>
      </div>
    </div>
  )
}
