import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CharacterContextType {
  inputText: string
  setInputText: (text: string) => void
  characters: string[]
  setCharacters: (chars: string[]) => void
  currentChar: string | null
  setCurrentChar: (char: string | null) => void
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined)

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inputText, setInputText] = useState<string>('')
  const [characters, setCharacters] = useState<string[]>([])
  const [currentChar, setCurrentChar] = useState<string | null>(null)

  return (
    <CharacterContext.Provider
      value={{
        inputText,
        setInputText,
        characters,
        setCharacters,
        currentChar,
        setCurrentChar,
      }}
    >
      {children}
    </CharacterContext.Provider>
  )
}

export const useCharacterContext = () => {
  const context = useContext(CharacterContext)
  if (context === undefined) {
    throw new Error('useCharacterContext must be used within a CharacterProvider')
  }
  return context
}

