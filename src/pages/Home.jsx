import { useEffect, useState } from "react";
import ProductList from '../components/ProductList';

export default function Home() {
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: '', descripcion: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || ''
      const response = await fetch(`${API_URL.replace(/\/$/, '')}/api/miguel`)
      const data = await response.json()
      setData(data)
    } catch (e) {
      console.error('failed to fetch user data', e)
    }
  }

  const API_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || ''
  const productsApiBase = `${API_URL.replace(/\/$/, '')}/api/productos`
  const listApiUrl = searchQuery ? `${productsApiBase}?q=${encodeURIComponent(searchQuery)}` : productsApiBase

  const initials = data ? `${(data.name||'')[0] || ''}${(data.lastName||'')[0] || ''}`.toUpperCase() : ''

  // debounce searchTerm -> searchQuery
  useEffect(() => {
    if (searchTerm === '') {
      setSearchQuery('')
      setSearching(false)
      return
    }
    setSearching(true)
    const t = setTimeout(() => {
      setSearchQuery(searchTerm)
      setSearching(false)
    }, 500)
    return () => clearTimeout(t)
  }, [searchTerm])

  return (
    <div className='w-full px-5 flex flex-col gap-5 box-border h-full'>
      <div className="bg-white border border-indigo-100 rounded-md p-4 flex items-center justify-between gap-4 shadow-sm">
        <form className="flex items-center gap-2 flex-1 max-w-lg" onSubmit={(e) => { e.preventDefault(); setSearchQuery(searchTerm) }}>
          <input
            aria-label="Buscar productos"
            placeholder="Buscar productos por nombre, categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
          />
          <button type="submit" className="px-3 py-2 rounded-md bg-indigo-600 text-white flex items-center gap-2">{searching ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> : 'Buscar'}</button>
          <button type="button" onClick={() => { setSearchTerm(''); setSearchQuery('') }} className="px-3 py-2 rounded-md border ml-2">Limpiar</button>
        </form>

        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right mr-2">
            <span className="text-sm font-medium  text-blue-800">{data ? `${data.name} ${data.lastName}` : 'Invitado'}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{data?.email || data?.role || 'Usuario'}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">{initials || 'U'}</div>
        </div>
      </div>

      <div className="bg-white border border-indigo-100 rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Lista de productos</h1>
          <button
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 text-white px-3 py-2 rounded-md text-sm"
            onClick={() => {
              setModalOpen(true)
              setForm({ nombre: '', precio: '', categoria: '', descripcion: '' })
              setErrors({})
              setSuccess(false)
            }}
          >
            Agregar
          </button>
        </div>
  {/* ProductList will fetch products from your API and render ProductCard components */}
  <ProductList apiUrl={listApiUrl} refreshKey={refreshKey} onEdit={() => setRefreshKey(k => k + 1)} filter={searchQuery} />

        {/* Modal: create product */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => { if (!submitting) setModalOpen(false) }} />
            <div className="relative bg-white  text-blue-300 dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
              {!success ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">Agregar producto</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="flex flex-col">
                      <span className="text-sm mb-1">Nombre</span>
                      <input value={form.nombre} placeholder="  Mause Inalambrico " onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} className={`border px-3 py-2 rounded ${errors.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                      {errors.nombre && <small className="text-red-600">{errors.nombre}</small>}
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm mb-1">Precio</span>
                      <input value={form.precio} placeholder="$500" onChange={(e) => setForm(f => ({ ...f, precio: e.target.value }))} className={`border px-3 py-2 rounded ${errors.precio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                      {errors.precio && <small className="text-red-600">{errors.precio}</small>}
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm mb-1">Categoría</span>
                      <input value={form.categoria} placeholder="Bebidas" onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))} className={`border px-3 py-2 rounded ${errors.categoria ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                      {errors.categoria && <small className="text-red-600">{errors.categoria}</small>}
                    </label>

                    <label className="flex flex-col">
                      <span className="text-sm mb-1">Descripción</span>
                      <textarea value={form.descripcion} placeholder="Bebida dulce cremosa" onChange={(e) => setForm(f => ({ ...f, descripcion: e.target.value }))} className={`border px-3 py-2 rounded h-24 ${errors.descripcion ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                      {errors.descripcion && <small className="text-red-600">{errors.descripcion}</small>}
                    </label>
                  </div>

                  <div className="mt-4 flex gap-3 justify-end">
                    <button className="px-4 py-2 rounded border" onClick={() => { if (!submitting) setModalOpen(false) }}>Cancelar</button>
                    <button
                      className="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2"
                      onClick={async () => {
                        // validation
                        const newErrors = {}
                        if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
                        if (!form.precio.trim()) newErrors.precio = 'El precio es obligatorio'
                        if (!form.categoria.trim()) newErrors.categoria = 'La categoría es obligatoria'
                        if (!form.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria'
                        setErrors(newErrors)
                        if (Object.keys(newErrors).length) return

                        setSubmitting(true)
                        try {
                          const API_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || ''
                          const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/producto`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(form),
                          })
                          if (!res.ok) {
                            const txt = await res.text().catch(() => '')
                            throw new Error(`HTTP ${res.status} ${txt}`)
                          }
                          setSuccess(true)
                          setRefreshKey(k => k + 1)
                        } catch (err) {
                          console.error('Failed to add product', err)
                          setErrors({ submit: err.message || 'Error al agregar producto' })
                        } finally {
                          setSubmitting(false)
                        }
                      }}
                    >
                      {submitting ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                      ) : 'Guardar'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="text-green-700">Producto agregado correctamente.</div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={() => { setModalOpen(false); setSuccess(false) }}>Aceptar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
