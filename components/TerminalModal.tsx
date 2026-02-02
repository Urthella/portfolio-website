
"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Command {
    input: string
    output: React.ReactNode
}

export default function TerminalModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMaximized, setIsMaximized] = useState(false)
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<Command[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' })
            inputRef.current?.focus()
        }
    }, [history, isOpen])

    const handleCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim().toLowerCase()
        let output: React.ReactNode = ''

        switch (trimmedCmd) {
            case 'help':
                output = (
                    <div className="space-y-1">
                        <p>Available commands:</p>
                        <p className="text-white">  about     <span className="text-gray-500">- Who am I?</span></p>
                        <p className="text-white">  skills    <span className="text-gray-500">- My technical skills</span></p>
                        <p className="text-white">  projects  <span className="text-gray-500">- View my projects</span></p>
                        <p className="text-white">  contact   <span className="text-gray-500">- Get in touch</span></p>
                        <p className="text-white">  clear     <span className="text-gray-500">- Clear terminal</span></p>
                        <p className="text-white">  exit      <span className="text-gray-500">- Close terminal</span></p>
                        <p className="text-white">  sudo      <span className="text-gray-500">- ???</span></p>
                    </div>
                )
                break
            case 'about':
                output = "I'm Utku, a Computer Engineering student passionate about backend, DevOps, and cybersecurity."
                break
            case 'skills':
                output = "Java, Spring Boot, TypeScript, React, Next.js, Docker, MongoDB, Kafka, Linux, Cybersecurity tools..."
                break
            case 'projects':
                output = "Extramus HR, Reveil Game, Portfolio, MIPS16 Simulator, Algorithm Analyzer..."
                break
            case 'contact':
                output = "Email: utkudemirtas0@gmail.com | LinkedIn: /in/utkudemirtas"
                break
            case 'clear':
                setHistory([])
                return
            case 'exit':
                setIsOpen(false)
                return
            case 'sudo':
                output = <span className="text-white font-bold">Permission denied: You are not root! type 'help' for available commands.</span>
                break
            case '':
                output = ''
                break
            default:
                output = <span className="text-white">Command not found: {cmd}. Type 'help' for available commands.</span>
        }

        setHistory(prev => [...prev, { input: cmd, output }])
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input)
            setInput('')
        }
    }

    return (
        <>
            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-50 rounded-full w-14 h-14 bg-black/80 border border-gray-600 text-white hover:bg-gray-800 hover:border-white hover:scale-110 transition-all duration-300 shadow-lg shadow-gray-500/20 ${isOpen ? 'hidden' : 'flex'}`}
            >
                <TerminalIcon className="w-6 h-6" />
            </Button>

            {/* Terminal Window */}
            {isOpen && (
                <div className={`fixed z-50 transition-all duration-300 bg-black/95 border border-gray-800 text-gray-300 font-mono shadow-2xl shadow-gray-500/10 backdrop-blur-md flex flex-col
          ${isMaximized ? 'inset-0 rounded-none' : 'bottom-8 right-8 w-[90vw] h-[60vh] md:w-[600px] md:h-[400px] rounded-xl'}`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-white/5">
                        <div className="flex items-center gap-2">
                            <TerminalIcon className="w-4 h-4" />
                            <span className="text-sm font-bold">guest@urthella:~$</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-1 hover:text-white transition-colors"
                                title={isMaximized ? "Restore" : "Maximize"}
                            >
                                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:text-red-400 transition-colors"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent"
                        onClick={() => inputRef.current?.focus()}
                    >
                        <div className="text-sm opacity-70 mb-4">
                            Welcome to Urthella Terminal v1.0.0
                            <br />
                            Type <span className="text-white font-bold">'help'</span> to see available commands.
                        </div>

                        {history.map((item, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">➜</span>
                                    <span className="text-white">~</span>
                                    <span>{item.input}</span>
                                </div>
                                {item.output && <div className="pl-6 mb-2">{item.output}</div>}
                            </div>
                        ))}

                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">➜</span>
                            <div className="relative flex-1">
                                <span className="text-white absolute left-0">~</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full bg-transparent border-none outline-none pl-4 text-white caret-gray-500"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div ref={bottomRef} />
                    </div>
                </div>
            )}
        </>
    )
}
