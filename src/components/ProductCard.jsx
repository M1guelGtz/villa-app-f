import { useEffect, useState } from "react"

export default function ProductCard({ product, onEdit }) {
  // normalize fields for different API shapes
  const initialName = product.name || product.producto || 'Sin nombre'
  const initialDescription = product.description || product.descripcion || ''
  const initialPrice = product.price ?? product.precio ?? null
  const initialImage = product.image || product.imagen || product.img || null
  const id = product.id || product._id || product._id_str || product.uuid || null

  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(initialName)
  const [displayDescription, setDisplayDescription] = useState(initialDescription)
  const [displayPrice, setDisplayPrice] = useState(initialPrice)
  const [displayImage, setDisplayImage] = useState(initialImage)

  const [form, setForm] = useState({ nombre: initialName, precio: initialPrice != null ? String(initialPrice) : '', categoria: product.categoria || '', descripcion: initialDescription })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    // sync if product prop changes externally
    setDisplayName(initialName)
    setDisplayDescription(initialDescription)
    setDisplayPrice(initialPrice)
    setDisplayImage(initialImage)
    setForm({ nombre: initialName, precio: initialPrice != null ? String(initialPrice) : '', categoria: product.categoria || '', descripcion: initialDescription })
  }, [product])

  return (
    <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="w-full h-48 bg-indigo-50 dark:bg-gray-500 flex items-center justify-center">
        {displayImage ? (
          <img src={displayImage} alt={displayName} className="object-contain h-full w-full" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">{displayName}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{displayDescription}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-indigo-700 dark:text-indigo-300 font-bold">{displayPrice != null ? `$${Number(displayPrice).toFixed(2)}` : '—'}</span>
          <div className="flex items-center gap-2">
            <button className="border border-indigo-200 text-indigo-700 px-3 py-1 rounded-md text-sm" onClick={() => setEditing(true)}>Editar</button>
            <button className="border border-red-200 text-red-600 px-3 py-1 rounded-md text-sm" onClick={() => {
              if (!id) { setErrors({ submit: 'ID no disponible para eliminar' }); return }
              setConfirmingDelete(true)
            }}>Eliminar</button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { if (!deleting) setConfirmingDelete(false) }} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h4 className="text-lg text-red-500 font-semibold mb-2">Confirmar eliminación</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">¿Estás seguro que deseas eliminar el producto "{displayName}"? Esta acción no se puede deshacer.</p>
            <div className="mt-4 flex justify-end gap-3">
              <button className="px-3 py-2 rounded text-blue-300 border" onClick={() => { if (!deleting) setConfirmingDelete(false) }}>Cancelar</button>
              <button className="px-3 py-2 rounded bg-red-600 text-white flex items-center gap-2" onClick={async () => {
                setDeleting(true)
                try {
                  const API_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || ''
                  const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/producto/${id}`, { method: 'DELETE' })
                  if (!res.ok) {
                    const txt = await res.text().catch(() => '')
                    throw new Error(`HTTP ${res.status} ${txt}`)
                  }
                  setConfirmingDelete(false)
                  if (typeof onEdit === 'function') onEdit()
                } catch (err) {
                  console.error('Failed to delete product', err)
                  setErrors({ submit: err.message || 'Error al eliminar producto' })
                } finally {
                  setDeleting(false)
                }
              }}>
                {deleting ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> : 'Confirmar'}
              </button>
            </div>
            {errors.submit && <div className="mt-3 text-red-600">{errors.submit}</div>}
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 text-blue-200 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { if (!submitting) setEditing(false) }} />
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Editar producto</h3>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col">
                <span className="text-sm mb-1">Nombre</span>
                <input value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} className={`border px-3 py-2 rounded ${errors.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                {errors.nombre && <small className="text-red-600">{errors.nombre}</small>}
              </label>

              <label className="flex flex-col">
                <span className="text-sm mb-1">Precio</span>
                <input value={form.precio} onChange={(e) => setForm(f => ({ ...f, precio: e.target.value }))} className={`border px-3 py-2 rounded ${errors.precio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                {errors.precio && <small className="text-red-600">{errors.precio}</small>}
              </label>

              <label className="flex flex-col">
                <span className="text-sm mb-1">Categoría</span>
                <input value={form.categoria} onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))} className={`border px-3 py-2 rounded ${errors.categoria ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                {errors.categoria && <small className="text-red-600">{errors.categoria}</small>}
              </label>

              <label className="flex flex-col">
                <span className="text-sm mb-1">Descripción</span>
                <textarea value={form.descripcion} onChange={(e) => setForm(f => ({ ...f, descripcion: e.target.value }))} className={`border px-3 py-2 rounded h-24 ${errors.descripcion ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                {errors.descripcion && <small className="text-red-600">{errors.descripcion}</small>}
              </label>
            </div>

            <div className="mt-4 flex gap-3 justify-end">
              <button className="px-4 py-2 rounded border" onClick={() => { if (!submitting) setEditing(false) }}>Cancelar</button>
              <button className="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2" onClick={async () => {
                const newErrors = {}
                if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
                if (!form.precio.toString().trim()) newErrors.precio = 'El precio es obligatorio'
                if (!form.categoria.trim()) newErrors.categoria = 'La categoría es obligatoria'
                if (!form.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria'
                setErrors(newErrors)
                if (Object.keys(newErrors).length) return

                if (!id) {
                  setErrors({ submit: 'ID del producto no disponible' })
                  return
                }

                setSubmitting(true)
                try {
                  const API_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || ''
                  const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/producto/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre: form.nombre, precio: form.precio, categoria: form.categoria, descripcion: form.descripcion }),
                  })
                  if (!res.ok) {
                    const txt = await res.text().catch(() => '')
                    throw new Error(`HTTP ${res.status} ${txt}`)
                  }
                  // update displayed values immediately
                  setDisplayName(form.nombre)
                  setDisplayDescription(form.descripcion)
                  setDisplayPrice(form.precio)
                  // if image handled, setDisplayImage(...)
                  setEditing(false)
                  if (typeof onEdit === 'function') onEdit()
                } catch (err) {
                  console.error('Failed to update product', err)
                  setErrors({ submit: err.message || 'Error al actualizar producto' })
                } finally {
                  setSubmitting(false)
                }
              }}>{submitting ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> : 'Guardar'}</button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
