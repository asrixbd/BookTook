"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error('Error:', error)
      else setBooks(data || [])
      setLoading(false)
    }
    fetchBooks()
  }, [])

  if (loading) return <div className="p-10 text-center font-sans">Opening the Library...</div>

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="max-w-4xl mx-auto mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-black text-blue-600 tracking-tight">BookTook</h1>
        <a href="/upload" className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold shadow-md hover:bg-blue-700 transition">
          + Upload
        </a>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {books.length === 0 ? (
          <div className="text-center col-span-full py-20 text-gray-400">
            <p className="text-xl">The shelves are empty.</p>
            <p>Be the first to add a book!</p>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h2>
              <p className="text-blue-500 font-medium mb-4">by {book.author || 'Anonymous'}</p>
              
              <div className="bg-gray-100 rounded-2xl overflow-hidden h-96 mb-4 border border-gray-200">
                <iframe
                  src={`https://nitjttokbnsoxkrwrxfo.supabase.co/storage/v1/object/public/pdfs/${book.file_url}`}
                  className="w-full h-full"
                  title={book.title}
                />
              </div>

              <p className="text-gray-600 text-sm italic">"{book.description}"</p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
