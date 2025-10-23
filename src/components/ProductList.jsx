import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

const DEFAULT_API_URL = (() => {
  const API_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || ''
  if (!API_URL) return '/api/products'
  return `${API_URL.replace(/\/$/, '')}/api/productos`
})()

export default function ProductList({ apiUrl = DEFAULT_API_URL, refreshKey = 0, onEdit, filter = '' }) {
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(apiUrl, { signal: controller.signal })
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`HTTP ${res.status} ${text}`)
        }

        let data
        try {
          data = await res.json()
        } catch (jsonErr) {
          const txt = await res.text().catch(() => '')
          console.error('Failed to parse JSON from products API, text:', txt)
          throw new Error('Invalid JSON response from products API')
        }

        if (!mounted) return
        const list = Array.isArray(data) ? data : data.products || data.productos || []
        setAllProducts(list)
        // apply filter client-side (fallback)
        const normalizedFilter = (filter || '').toString().trim().toLowerCase()
        if (!normalizedFilter) setProducts(list)
        else {
          const filtered = list.filter((item) => {
            const name = (item.name || item.producto || '').toString().toLowerCase()
            const desc = (item.description || item.descripcion || '').toString().toLowerCase()
            const cat = (item.categoria || item.category || '').toString().toLowerCase()
            return name.includes(normalizedFilter) || desc.includes(normalizedFilter) || cat.includes(normalizedFilter)
          })
          setProducts(filtered)
        }
      } catch (err) {
        if (!mounted) return
        console.error('ProductList fetch error:', err)
        if (err.name === 'AbortError') setError('La solicitud tardó demasiado y fue cancelada.')
        else setError(err.message || 'Error al cargar productos')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
      controller.abort()
      clearTimeout(timeout)
    }
  }, [apiUrl, refreshKey, filter])

  // keep products updated when filter changes (without re-fetch)
  useEffect(() => {
    const normalizedFilter = (filter || '').toString().trim().toLowerCase()
    if (!normalizedFilter) {
      setProducts(allProducts)
      return
    }
    const filtered = allProducts.filter((item) => {
      const name = (item.name || item.producto || '').toString().toLowerCase()
      const desc = (item.description || item.descripcion || '').toString().toLowerCase()
      const cat = (item.categoria || item.category || '').toString().toLowerCase()
      return name.includes(normalizedFilter) || desc.includes(normalizedFilter) || cat.includes(normalizedFilter)
    })
    setProducts(filtered)
  }, [filter, allProducts])

  if (loading) return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-indigo-600">
        <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="font-medium">Cargando productos...</span>
      </div>
    </div>
  )

  if (error) return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="text-red-700 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-md border border-red-100 dark:border-red-800">Error: {error}</div>
    </div>
  )

  if (!products || !products.length) return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="text-indigo-600">No hay productos</div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id || p._id || p.name || p.producto || JSON.stringify(p)} product={p} onEdit={onEdit} />
      ))}
    </div>
  )
}
