'use client'

import { useEffect, useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Star, X, Plus, GitFork, CircleDot, Moon, Sun, Github } from 'lucide-react'
import Image from 'next/image'

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  stargazers_count: number
  open_issues_count: number
  forks_count: number
  watchers_count: number
  topics: string[]
  html_url: string
  language: string
  updated_at: string
}

interface LanguageColors {
  [key: string]: string
}

const predefinedTopics = ['note', 'free', 'opensource', 'markdown', 'wiki']

export default function GithubTopicsExplorer() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('all')
  const [sort, setSort] = useState('stars')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [customTopic, setCustomTopic] = useState('')
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [languageColors, setLanguageColors] = useState<LanguageColors>({})
  const [userPreference, setUserPreference] = useState<'system' | 'light' | 'dark'>('system')

  useEffect(() => {
    const fetchLanguageColors = async () => {
      try {
        const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/colors-aoOFmoXcb0KS7kGhlpF9BZxOEBoHLi.json')
        const colors = await response.json()
        setLanguageColors(colors)
      } catch (error) {
        console.error('Error fetching language colors:', error)
      }
    }

    fetchLanguageColors()

    const savedTopics = localStorage.getItem('savedTopics')
    if (savedTopics) {
      const parsedTopics = JSON.parse(savedTopics)
      setAvailableTopics([...new Set([...predefinedTopics, ...parsedTopics])])
    } else {
      setAvailableTopics(predefinedTopics)
    }

    const savedSelectedTopics = localStorage.getItem('selectedTopics')
    if (savedSelectedTopics) {
      setSelectedTopics(JSON.parse(savedSelectedTopics))
    } else {
      setSelectedTopics(['note', 'free'])
    }

    const savedPreference = localStorage.getItem('colorPreference')
    if (savedPreference) {
      setUserPreference(savedPreference as 'system' | 'light' | 'dark')
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (userPreference === 'system') {
        setDarkMode(mediaQuery.matches)
        document.documentElement.classList.toggle('dark', mediaQuery.matches)
      }
    }

    if (userPreference === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else if (userPreference === 'light') {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      handleChange()
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [userPreference])

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true)
      try {
        if (selectedTopics.length === 0) {
          setRepositories([])
        } else {
          const topicsQuery = selectedTopics.map(topic => `topic:${topic}`).join('+')
          const response = await fetch(
            `https://api.github.com/search/repositories?q=${topicsQuery}&sort=stars&order=desc&per_page=100`
          )
          const data = await response.json()
          setRepositories(data.items)
        }
      } catch (error) {
        console.error('Error fetching repositories:', error)
      }
      setLoading(false)
    }

    fetchRepositories()
    localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics))
  }, [selectedTopics])

  const sortRepositories = (repos: Repository[]) => {
    switch (sort) {
      case 'stars':
        return repos.sort((a, b) => b.stargazers_count - a.stargazers_count)
      case 'forks':
        return repos.sort((a, b) => b.forks_count - a.forks_count)
      case 'updated':
        return repos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      default:
        return repos
    }
  }

  const filteredAndSortedRepositories = sortRepositories(
    repositories.filter((repo) => {
      if (language === 'all') return true
      return repo.language?.toLowerCase() === language.toLowerCase()
    })
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleTopicChange = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const handleAddCustomTopic = () => {
    if (customTopic && !availableTopics.includes(customTopic)) {
      const newAvailableTopics = [...availableTopics, customTopic]
      
      setAvailableTopics(newAvailableTopics)
      setSelectedTopics(prev => [...prev, customTopic])
      setCustomTopic('')
      localStorage.setItem('savedTopics', JSON.stringify(newAvailableTopics))
    }
    if (availableTopics.includes(customTopic)) {
        setSelectedTopics(prev => 
            prev.includes(customTopic) 
              ? prev.filter(t => t !== customTopic)
              : [...prev, customTopic]
          )      }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCustomTopic()
    }
  }

  const handleAddTopicFromResult = (topic: string) => {
    if (!availableTopics.includes(topic)) {
      const newAvailableTopics = [...availableTopics, topic]
      setAvailableTopics(newAvailableTopics)
      localStorage.setItem('savedTopics', JSON.stringify(newAvailableTopics))
    }
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics(prev => [...prev, topic])
    }
  }

  const toggleDarkMode = () => {
    const newMode = darkMode ? 'light' : 'dark'
    setDarkMode(!darkMode)
    setUserPreference(newMode)
    localStorage.setItem('colorPreference', newMode)
    document.documentElement.classList.toggle('dark', newMode === 'dark')
  }

  const resetToSystemPreference = () => {
    setUserPreference('system')
    localStorage.setItem('colorPreference', 'system')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(systemPrefersDark)
    document.documentElement.classList.toggle('dark', systemPrefersDark)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-[#0d1117] text-black dark:text-white min-h-screen transition-colors duration-200">
        <div className="container mx-auto p-6">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium bg-black p-2 rounded-lg">
                    <Github className="text-white "/> 
                </span>
                <h1 className="text-3xl font-bold">GitHub Topics Explorer</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2" onClick={toggleDarkMode}>
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {darkMode ? 'Light' : 'Dark'} Mode
                </Button>
                {userPreference !== 'system' && (
                  <Button variant="ghost" size="sm" onClick={resetToSystemPreference}>
                    Reset to System
                  </Button>
                )}
              </div>
            </div>
            <a 
              href="https://www.producthunt.com/posts/github-multi-topic-explorer?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-github-multi-topic-explorer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex inline-flex select-none"
            > 
              <Image 
                src="https://s6.imgcdn.dev/E06Uy.png" 
                alt="GitHub Multi-Topic Explorer - A Tool for Multiple Topics Searches | Product Hunt" 
                width="156" 
                height="58" 
              />
            </a>
            <p className="text-muted-foreground">
              Explore {filteredAndSortedRepositories.length} public repositories matching selected topics
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="c++">C++</SelectItem>


                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stars">Most stars</SelectItem>
                  <SelectItem value="forks">Most forks</SelectItem>
                  <SelectItem value="updated">Recently updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Select Topics:</h2>
              <div className="flex flex-wrap gap-2">
                {availableTopics.map((topic) => (
                  <label key={topic} className="flex items-center space-x-2">
                    <Checkbox
                      id={topic}
                      
                      checked={selectedTopics.includes(topic)}
                      onCheckedChange={() => handleTopicChange(topic)}
                    />
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Add custom topic"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                className="max-w-xs"
              />
              <Button onClick={handleAddCustomTopic} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <Button
                  key={topic}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleTopicChange(topic)}
                  className="gap-1"
                >
                  {topic}
                  <X className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-white dark:bg-[#161b22] border-[#d0d7de] dark:border-[#30363d]">
                  <CardHeader>
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))
            ) : (
              selectedTopics.length === 0 ? (
                <Card className="bg-white dark:bg-[#161b22] border-[#d0d7de] dark:border-[#30363d]">
                  <CardContent className="text-center py-6">
                    <p className="text-muted-foreground">No topics selected. Please select at least one topic to see repositories.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAndSortedRepositories.map((repo) => (
                  <Card key={repo.id} className="bg-white dark:bg-[#161b22] border-[#d0d7de] dark:border-[#30363d]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-[#0969da] dark:text-[#58a6ff] hover:underline">
                            <a href={`https://github.com/${repo.full_name}`} target="_blank" rel="noopener noreferrer">
                              {repo.full_name}
                            </a>
                          </CardTitle>
                          <p className="mt-2 text-muted-foreground">{repo.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {repo.topics.map((topic) => (
                          <button
                            key={topic}
                            onClick={() => handleAddTopicFromResult(topic)}
                            className="rounded-full bg-[#ddf4ff] dark:bg-[#388bfd26] px-3 py-1 text-xs font-medium text-[#0969da] dark:text-[#58a6ff] hover:bg-[#0969da1a] dark:hover:bg-[#388bfd4d] transition-colors"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-[#57606a] dark:text-[#8b949e] gap-4">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span 
                              className="relative flex h-3 w-3 rounded-full"
                              style={{ backgroundColor: languageColors[repo.language] || '#ccc' }}
                            ></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {repo.stargazers_count.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          {repo.forks_count.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <CircleDot className="h-4 w-4" />
                          {repo.open_issues_count.toLocaleString()}
                        </span>
                        <span>Updated on {formatDate(repo.updated_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}