import React, { useState, useRef } from 'react';
import { Mail, Link as LinkIcon, QrCode, Upload, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = '';

const Analyzer = ({ onScanComplete }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Form states
  const [emailText, setEmailText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [qrFile, setQrFile] = useState(null);
  const [qrFilename, setQrFilename] = useState('');
  const fileInputRef = useRef(null);

  const handleEmailAnalyze = async (e) => {
    e?.preventDefault();
    if (!emailText.trim()) {
      setError('Please enter email content to analyze.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/detect/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: emailText })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        onScanComplete?.();
      } else {
        setError(data.error || 'Failed to analyze email');
      }
    } catch (err) {
      setError('Network error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleURLAnalyze = async (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) {
      setError('Please enter a URL to analyze.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/detect/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        onScanComplete?.();
      } else {
        setError(data.error || 'Failed to analyze URL');
      }
    } catch (err) {
      setError('Network error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRAnalyze = async (e) => {
    e?.preventDefault();
    if (!qrFile) {
      setError('Please select a QR code image to scan.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('image', qrFile);

    try {
      const response = await fetch(`${API_BASE_URL}/detect/qr`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        onScanComplete?.();
      } else {
        setError(data.error || 'Failed to scan QR code');
      }
    } catch (err) {
      setError('Network error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files?.length > 0) {
      setQrFile(e.target.files[0]);
      setQrFilename(e.target.files[0].name);
    }
  };

  const ResultDisplay = ({ data }) => {
    const isPhishing = data.result === 'Phishing';
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-6 p-6 rounded-xl border ${
          isPhishing 
            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' 
            : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${isPhishing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {isPhishing ? <AlertTriangle className="size-8" /> : <CheckCircle2 className="size-8" />}
          </div>
          <div className="flex-1">
            <h5 className={`text-lg font-bold mb-2 ${isPhishing ? 'text-red-700' : 'text-green-700'}`}>
              {isPhishing ? 'Phishing Detected' : 'Legitimate'}
            </h5>
            <p className="text-sm mb-2 dark:text-gray-300">
              <strong>Confidence:</strong> {data.confidence}
            </p>
            
            {data.decoded_url && (
              <p className="text-sm mb-2 dark:text-gray-300">
                <strong>Decoded URL:</strong> <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{data.decoded_url}</code>
              </p>
            )}

            {data.warning && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                <AlertTriangle className="size-3" /> {data.warning}
              </p>
            )}

            <div className={`mt-4 p-3 rounded border text-xs ${
              isPhishing 
                ? 'bg-red-100/50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300' 
                : 'bg-green-100/50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
            }`}>
              <p className="font-semibold mb-1">
                {isPhishing ? '⚠️ Security Recommendation:' : '✓ Analysis Complete'}
              </p>
              <p>
                {isPhishing 
                  ? 'Do not click any links, download attachments, or provide personal information. Report this to your IT security team.'
                  : 'This appears to be legitimate, but always exercise caution and verify the source.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-16 bg-surface-light dark:bg-[#0d1117] border-y border-[#f0f2f4] dark:border-gray-800" id="tools">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { id: 'email', icon: Mail, title: 'Email Analysis', desc: 'Scan headers and body text for deceptive language and spoofing patterns.' },
            { id: 'url', icon: LinkIcon, title: 'Link Checker', desc: 'Verify URLs against real-time threat intelligence and look-alike domain databases.' },
            { id: 'qr', icon: QrCode, title: 'QR Code Scan', desc: 'Safely extract and analyze hidden URLs embedded within QR code images.' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); setError(null); }}
              className={`detection-card text-left bg-white dark:bg-[#161b22] p-8 rounded-xl border transition-all group ${
                activeTab === tab.id ? 'border-primary ring-1 ring-primary' : 'border-[#dbe0e6] dark:border-gray-700 hover:border-primary'
              }`}
            >
              <tab.icon className={`size-10 mb-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
              <h3 className="text-lg font-bold mb-2 dark:text-white">{tab.title}</h3>
              <p className="text-[#617589] dark:text-gray-400 text-sm leading-relaxed">{tab.desc}</p>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-[#161b22] rounded-xl border border-[#dbe0e6] dark:border-gray-700 shadow-sm p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                  <Mail className="text-primary" /> Analyze Email Content
                </h4>
                <textarea 
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full h-48 rounded-lg border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#0d1117] text-[#111418] dark:text-white focus:ring-primary focus:border-primary p-4 font-mono text-sm mb-6 outline-none transition-all"
                  placeholder="Paste the full email header and body here..."
                ></textarea>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#617589] dark:text-gray-400">Supported formats: .eml, plain text</span>
                  <button 
                    onClick={handleEmailAnalyze}
                    disabled={loading}
                    className="bg-primary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    {loading ? 'Analyzing...' : 'Analyze Email'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'url' && (
              <motion.div key="url" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                  <LinkIcon className="text-primary" /> Check Suspicious Link
                </h4>
                <input 
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleURLAnalyze()}
                  className="w-full h-14 rounded-lg border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#0d1117] text-[#111418] dark:text-white focus:ring-primary focus:border-primary px-4 mb-6 outline-none transition-all"
                  placeholder="https://suspicious-site.com/login"
                />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#617589] dark:text-gray-400">We check for redirect loops and zero-day phishing sites.</span>
                  <button 
                    onClick={handleURLAnalyze}
                    disabled={loading}
                    className="bg-primary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    {loading ? 'Analyzing...' : 'Check URL'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'qr' && (
              <motion.div key="qr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                  <QrCode className="text-primary" /> Scan QR Image
                </h4>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary'); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-primary'); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary');
                    if (e.dataTransfer.files?.length > 0) {
                      setQrFile(e.dataTransfer.files[0]);
                      setQrFilename(e.dataTransfer.files[0].name);
                    }
                  }}
                  className="border-2 border-dashed border-[#dbe0e6] dark:border-gray-700 rounded-xl p-16 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer bg-surface-light dark:bg-[#0d1117] mb-6"
                >
                  <Upload className="size-12 text-[#617589] mb-4" />
                  <p className="text-lg font-semibold dark:text-white">Drop QR code image here or click to upload</p>
                  <p className="text-[#617589] text-sm mt-2">Upload PNG, JPG or SVG files</p>
                </div>
                <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#617589] dark:text-gray-400">{qrFilename ? `Selected: ${qrFilename}` : ''}</span>
                  <button 
                    onClick={handleQRAnalyze}
                    disabled={loading}
                    className="bg-primary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    {loading ? 'Scanning...' : 'Scan Image'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-5" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {result && <ResultDisplay data={result} />}
        </div>
      </div>
    </section>
  );
};

export default Analyzer;

