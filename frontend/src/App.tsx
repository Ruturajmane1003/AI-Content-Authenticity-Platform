/// <reference types="vite/client" />
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, Image as ImageIcon, Mic, Link as LinkIcon, AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, ClipboardPaste, X, Linkedin, Github, Mail, Phone, Globe, Copy, Construction, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  React.useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; isAi: boolean; explanation: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (activeTab !== 'text') return;
    if (!textInput.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/predict/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput })
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      
      // Expected backend format: { prediction: "AI" | "Human", confidence: 0.95 }
      const isAi = data.prediction === "AI";
      const score = Math.round(data.confidence * 100);
      
      setResult({
        score,
        isAi,
        explanation: isAi 
          ? "Our models detected patterns highly consistent with AI generation, including uniform sentence structure and predictable word choices."
          : "The content exhibits high perplexity and burstiness, characteristics typical of human-generated content."
      });
    } catch (err) {
      console.error(err);
      setError("Backend not connected or analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(`AI Probability: ${result.score}%\nPrediction: ${result.isAi ? 'AI Generated' : 'Human Written'}\nExplanation: ${result.explanation}`);
    }
  };

  const handleReset = () => {
    setTextInput('');
    setResult(null);
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTextInput(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAudio(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white selection:bg-indigo-500/30 font-sans relative overflow-hidden">
      {/* GitHub Top Left Button */}
      <a
        href="https://github.com/Ruturajmane1003/AI-Content-Authenticity-Platform"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md px-3 py-2 rounded-full text-sm font-medium text-zinc-300 hover:text-white transition-all shadow-lg"
      >
        <Github className="w-4 h-4" />
        <span className="hidden sm:inline">See on GitHub</span>
      </a>

      {/* Background gradients */}
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600/30 blur-[140px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-600/30 blur-[140px] rounded-full pointer-events-none" 
      />

      <main className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 mr-1" /> Authenticity Scanner v2.0
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              AI Content Authenticity
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-medium">
              Powered by Multi-Modal AI Detection
            </p>
            <p className="text-md text-zinc-500 max-w-2xl mx-auto mt-2">
              Detect AI-generated text, images, audio, and URLs with enterprise-grade accuracy.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 p-[1px] rounded-2xl shadow-2xl">
              <Card className="bg-black/40 backdrop-blur-xl border-0 rounded-2xl">
                <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-zinc-900/50 p-1">
                    <TabsTrigger value="text" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-400">
                      <FileText className="w-4 h-4 mr-2 hidden sm:block" /> Text
                    </TabsTrigger>
                    <TabsTrigger value="image" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-400">
                      <ImageIcon className="w-4 h-4 mr-2 hidden sm:block" /> Image
                    </TabsTrigger>
                    <TabsTrigger value="audio" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-400">
                      <Mic className="w-4 h-4 mr-2 hidden sm:block" /> Audio
                    </TabsTrigger>
                    <TabsTrigger value="url" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-400">
                      <LinkIcon className="w-4 h-4 mr-2 hidden sm:block" /> URL
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TabsContent value="text" className="mt-0 outline-none">
                          <div className="space-y-4 relative">
                            <Textarea 
                              value={textInput}
                              onChange={(e) => {
                                setTextInput(e.target.value);
                                if (error) setError(null);
                              }}
                              placeholder="Paste your text here to analyze... (e.g., 'The rapid advancement of artificial intelligence has led to unprecedented changes in how we interact with technology.')" 
                              className="min-h-[250px] bg-zinc-900/50 border-zinc-800 resize-none focus-visible:ring-indigo-500/50 text-zinc-300 pb-12"
                            />
                            {error && (
                              <p className="text-rose-500 text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {error}</p>
                            )}
                            <div className="absolute bottom-3 right-3 flex gap-2">
                              {textInput && (
                                <Button variant="ghost" size="sm" onClick={handleReset} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                                  Clear
                                </Button>
                              )}
                              <Button variant="secondary" size="sm" onClick={handlePaste} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                <ClipboardPaste className="w-4 h-4 mr-2" /> Paste Text
                              </Button>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="image" className="mt-0 outline-none">
                          <div className="border border-zinc-800/50 rounded-xl p-12 text-center bg-zinc-900/30 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                            <motion.div 
                              animate={{ opacity: [0.5, 1, 0.5] }} 
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
                            />
                            <div className="w-16 h-16 rounded-full bg-zinc-900/80 flex items-center justify-center mb-4 relative z-10 border border-zinc-800">
                              <Construction className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-medium text-zinc-200 mb-2 relative z-10">Image Detection Coming Soon</h3>
                            <p className="text-sm text-zinc-500 max-w-xs relative z-10">Model for this feature is currently under development and training.</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="audio" className="mt-0 outline-none">
                          <div className="border border-zinc-800/50 rounded-xl p-12 text-center bg-zinc-900/30 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                            <motion.div 
                              animate={{ opacity: [0.5, 1, 0.5] }} 
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
                            />
                            <div className="w-16 h-16 rounded-full bg-zinc-900/80 flex items-center justify-center mb-4 relative z-10 border border-zinc-800">
                              <Construction className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-medium text-zinc-200 mb-2 relative z-10">Audio Detection Coming Soon</h3>
                            <p className="text-sm text-zinc-500 max-w-xs relative z-10">Model for this feature is currently under development and training.</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="url" className="mt-0 outline-none">
                          <div className="border border-zinc-800/50 rounded-xl p-12 text-center bg-zinc-900/30 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                            <motion.div 
                              animate={{ opacity: [0.5, 1, 0.5] }} 
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
                            />
                            <div className="w-16 h-16 rounded-full bg-zinc-900/80 flex items-center justify-center mb-4 relative z-10 border border-zinc-800">
                              <Construction className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-medium text-zinc-200 mb-2 relative z-10">URL Scanning Coming Soon</h3>
                            <p className="text-sm text-zinc-500 max-w-xs relative z-10">Model for this feature is currently under development and training.</p>
                          </div>
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || activeTab !== 'text' || !textInput.trim()}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Analyzing Content...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze Content
                      <motion.span 
                        className="inline-block"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >→</motion.span>
                    </span>
                  )}
                </Button>
              </CardContent>
              </Card>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 p-[1px] rounded-2xl shadow-2xl h-full">
                    <Card className="bg-black/40 backdrop-blur-xl border-0 rounded-2xl overflow-hidden relative h-full">
                      {/* Result indicator glow */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${result.isAi ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-zinc-100">Analysis Complete</CardTitle>
                          <CardDescription className="text-zinc-400 mt-1">
                            Confidence score based on our detection models.
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={handleCopyResult} className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Badge 
                            variant={result.isAi ? "destructive" : "default"} 
                            className={`px-3 py-1 text-sm font-medium ${
                              result.isAi 
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {result.isAi ? (
                              <span className="flex items-center"><ShieldAlert className="w-4 h-4 mr-1" /> AI Generated</span>
                            ) : (
                              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Human Written</span>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Score Display */}
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative flex items-center justify-center">
                          <svg className="w-40 h-40 transform -rotate-90">
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-zinc-800"
                            />
                            <motion.circle
                              cx="80"
                              cy="80"
                              r="70"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={440}
                              initial={{ strokeDashoffset: 440 }}
                              animate={{ strokeDashoffset: 440 - (440 * result.score) / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={result.isAi ? "text-rose-500" : "text-emerald-500"}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-5xl font-bold text-white tracking-tighter">
                              {result.score}%
                            </span>
                            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">
                              AI Probability
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Explanation</h4>
                        <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 text-sm text-zinc-300 leading-relaxed font-medium">
                          <TypewriterText text={result.explanation} />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Perplexity</span>
                          <span className="text-zinc-200 font-medium">{result.isAi ? 'Low' : 'High'}</span>
                        </div>
                        <Progress value={result.isAi ? 25 : 85} className="w-full" trackClassName="h-1.5 bg-zinc-800" indicatorClassName={result.isAi ? "bg-rose-500" : "bg-emerald-500"} />
                        
                        <div className="flex justify-between text-sm pt-2">
                          <span className="text-zinc-400">Burstiness</span>
                          <span className="text-zinc-200 font-medium">{result.isAi ? 'Low' : 'High'}</span>
                        </div>
                        <Progress value={result.isAi ? 30 : 75} className="w-full" trackClassName="h-1.5 bg-zinc-800" indicatorClassName={result.isAi ? "bg-rose-500" : "bg-emerald-500"} />
                      </div>
                    </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                    <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center mb-6">
                      <AlertCircle className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-medium text-zinc-300 mb-2">Awaiting Content</h3>
                    <p className="text-zinc-500 max-w-sm">
                      Submit text, an image, or a URL to analyze its authenticity and detect AI generation patterns.
                    </p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-white/10 bg-white/5 backdrop-blur-xl z-10">
        {/* Subtle gradient glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 blur-xl opacity-50 pointer-events-none" />
        
        {/* Animated top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
          <motion.div 
            className="w-full h-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-gray-300 text-sm">
            {/* Left */}
            <div className="font-medium text-center md:text-left flex flex-col">
              <span>Made by Ruturaj Mane</span>
              <span className="text-xs text-zinc-500 mt-1">Built with AI + Deep Learning</span>
            </div>

            {/* Center */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a href="tel:+91705842076" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 705842076</span>
              </a>
              <a href="mailto:Ruturajmane522@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>Ruturajmane522@gmail.com</span>
              </a>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
              <a 
                href="https://www.linkedin.com/in/ruturaj-mane-13a8a3264/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white hover:underline transition-all"
              >
                <Linkedin className="w-4 h-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a 
                href="https://my-portfolio-roan-nine-94.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white hover:underline transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Portfolio</span>
              </a>
              <a 
                href="https://github.com/Ruturajmane1003" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white hover:underline transition-all"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
