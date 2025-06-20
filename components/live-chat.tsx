"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MessageCircle, Send, User, Bot, Clock, CheckCircle2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "support"
  timestamp: Date
  status?: "sending" | "sent" | "delivered"
}

const SUPPORT_RESPONSES = [
  "Hello! I'm Adelaide from AeroHealth support. How can I help you today?",
  "I understand your concern about air quality in your area. Let me check the latest data for you.",
  "For real-time air quality alerts, make sure you have location permissions enabled in your settings.",
  "Our air quality data is updated every 15 minutes from multiple reliable sources across Ghana.",
  "You can access all courses and shop features even without internet - they're cached for offline use.",
  "If you're experiencing high pollution levels, I recommend checking our protection gear in the shop.",
  "Our health recommendations are personalized based on your location and exposure history.",
  "Is there anything specific about air quality monitoring you'd like me to explain?",
]

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message when chat opens
      setTimeout(() => {
        addSupportMessage(SUPPORT_RESPONSES[0])
      }, 1000)
    }
  }, [isOpen])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const addSupportMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: "support",
      timestamp: new Date(),
      status: "delivered",
    }
    setMessages((prev) => [...prev, message])
    setIsTyping(false)
  }

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    }
    setMessages((prev) => [...prev, message])

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "delivered" } : msg)))
    }, 500)

    // Simulate support typing and response
    setTimeout(() => {
      setIsTyping(true)
    }, 1000)

    setTimeout(
      () => {
        const randomResponse = SUPPORT_RESPONSES[Math.floor(Math.random() * SUPPORT_RESPONSES.length)]
        addSupportMessage(randomResponse)
      },
      2000 + Math.random() * 2000,
    )
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addUserMessage(inputValue)
    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-teal-600 hover:bg-teal-700 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open live chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 bg-teal-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-white">Live Support</SheetTitle>
                <SheetDescription className="text-teal-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {isOnline ? "Online - Average response: 2 min" : "Offline - Messages will be queued"}
                  </div>
                </SheetDescription>
              </div>
              <Badge className="bg-teal-100 text-teal-700">Ghana Support</Badge>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "support" && (
                        <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3 h-3 text-teal-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 opacity-60" />
                          <span className="text-xs opacity-60">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.sender === "user" && message.status === "delivered" && (
                            <CheckCircle2 className="w-3 h-3 opacity-60" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-teal-600" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isOnline ? "Type your message..." : "Message will be sent when online"}
                className="flex-1"
                disabled={!isOnline}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !isOnline}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {isOnline
                ? "Professional support team available 24/7"
                : "You're offline. Messages will be sent when connection is restored."}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
