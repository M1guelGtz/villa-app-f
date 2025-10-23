import { useState } from 'react'

function LoginField({ label, placeholder = '', type = 'text', id }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase()

  const floating = focused || value.length > 0
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="mb-6 relative w-full">
      <label
        htmlFor={inputId}
        className={`absolute left-3 px-1 bg-white  transition-all duration-200 pointer-events-none origin-left ${
          floating 
            ? 'top-0 -translate-y-1/2 text-xs font-medium text-indigo-600 dark:text-indigo-400' 
            : 'top-1/2 -translate-y-1/2 text-base text-gray-500 dark:text-gray-400'
        }`}
      >
        {label}
      </label>

      <input
        id={inputId}
        type={inputType}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ''}
        className={`block w-full rounded-lg border px-4 py-3 text-base bg-white    transition-all duration-200 ${
          focused 
            ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900/50 outline-none' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isPassword ? 'pr-12' : ''}`}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}

export default LoginField