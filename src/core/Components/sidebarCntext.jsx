import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(true)
    const toggleSidebar = () => setIsOpen(prev => !prev)
    const [list] = useState([
        { name: 'Home', path: '/', icon: 'icons/home.png' },
        { name: 'About', path: '/about', icon: 'icons/about.png' },
        { name: 'Services', path: '/services', icon: 'icons/services.png' },
        { name: 'Contact', path: '/contact', icon: 'icons/contacto.png' },
    ])

    const value = { isOpen, toggleSidebar, list }
    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}