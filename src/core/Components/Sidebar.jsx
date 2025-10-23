import { Link } from 'react-router-dom'
import { useSidebar } from './sidebarCntext.jsx'
import { useToast } from './Toast.jsx'

function Sidebar() {
    const { list, isOpen, toggleSidebar } = useSidebar()
    const { showToast } = useToast()
        const renderItem = (item) => (
            <li className="flex rounded-md bg-indigo-50 w-full justify-center items-center transition-transform duration-200 hover:scale-105 hover:bg-indigo-100" key={item.name}>
            <div className="relative w-full group">
                <Link
                    className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} w-full`}
                    to={item.path}
                    onClick={(e) => {
                        e.preventDefault()
                        showToast('Estamos trabajando en ello')
                    }}
                >
                    <img className="invert p-2" src={item.icon} alt={item.name} />
                    {isOpen && <span className="block w-2/3">{item.name}</span>}
                </Link>
                    {!isOpen && (
                    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap bg-indigo-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.name}
                    </span>
                )}
            </div>
        </li>
    )

    const bottomItems = [
        { name: 'Logout', path: '/logout', icon: 'icons/about.png' },
        { name: 'Configuración', path: '/configuracion', icon: 'icons/services.png' },
    ]

    return (
        <nav className={`flex flex-col items-center fixed top-5 left-5 bottom-5 p-4 ${isOpen ? 'w-64' : 'w-24'} transition-all duration-300 z-20 bg-white/80 backdrop-blur rounded-md shadow-lg border border-indigo-100`}>
            <span className={`bg-indigo-700 text-white rounded p-2 text-2xl font-bold flex justify-center ${isOpen ? 'w-full' : 'w-10 h-10 items-center rounded-full'}`}>{isOpen ? 'App ' : 'V'}</span>

            <div className="relative group">
                <button
                    className={`p-2 m-3 absolute rounded-full  flex justify-center items-center border-indigo-200 border-dashed w-10 h-10 transition-transform duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 ${isOpen ? 'translate-x-[105px] -translate-y-[90px] border-l bg-gradient-to-l from-indigo-600 to-indigo-400' : 'border-r bg-gradient-to-r translate-x-6 -translate-y-[82px] from-indigo-600 to-indigo-400'}`}
                    onClick={() => toggleSidebar()}
                    aria-label={isOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
                >
                    {isOpen ? '<' : '>'}
                </button>

                <span className={`${isOpen ? "translate-x-40 -translate-y-18" : "translate-x-20 -translate-y-16"} pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap bg-indigo-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {isOpen ? 'Cerrar' : 'Abrir'}
                </span>
            </div>

            <ul className="flex w-full mt-5 gap-3 flex-col">
                {list.map(renderItem)}
            </ul>

            <ul className="flex flex-col gap-3 w-full mt-auto mb-2">
                {bottomItems.map((it) => (
                      <li className="flex rounded-md border border-indigo-100 w-full justify-center items-center transition-transform duration-200 hover:scale-105 hover:bg-indigo-50" key={it.name}>
                        <div className="relative w-full group">
                            <Link
                                className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} w-full`}
                                to={it.path}
                                onClick={(e) => {
                                    e.preventDefault()
                                    showToast('Estamos trabajando en ello')
                                }}
                            >
                                <img className="invert p-2" src={it.icon} alt={it.name} />
                                {isOpen && <span className="block w-2/3">{it.name}</span>}
                            </Link>

                            {!isOpen && (
                                <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap bg-indigo-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {it.name}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Sidebar