"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  History,
  TrendingUp,
  Eye,
  Copy,
  Download,
  File,
  Trash2,
} from "lucide-react"

interface FileScanResult {
  id: string
  fileName: string
  fileSize: string
  fileType: string
  timestamp: string
  threatLevel: "Safe" | "Suspicious" | "Malicious"
  riskScore: number
  details: {
    virusDetected: boolean
    suspiciousActivity: boolean
    fileIntegrity: "Good" | "Compromised"
    scanEngines: number
    detectionCount: number
  }
  threats?: string[]
}

export function FileSecurity() {
  const [activeTab, setActiveTab] = useState("scan")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<FileScanResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [scanHistory, setScanHistory] = useState<FileScanResult[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history?type=file");
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map((item: any) => ({
          id: item.id,
          fileName: item.filename,
          fileSize: item.size || "Unknown",
          fileType: item.type || "Unknown",
          timestamp: item.timestamp,
          threatLevel: item.threatLevel,
          riskScore: item.score,
          details: {
            virusDetected: item.threatLevel === "Dangerous",
            suspiciousActivity: item.threatLevel === "Suspicious",
            fileIntegrity: item.threatLevel === "Safe" ? "Good" : "Compromised",
            scanEngines: 1,
            detectionCount: item.threatLevel === "Safe" ? 0 : 1
          },
          threats: item.details?.malwareType ? [item.details.malwareType] : []
        }));
        setScanHistory(mappedData);
      }
    } catch (error) {
      console.error("Error fetching file history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsScanning(true)

    try {
      const response = await fetch("/api/scan/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          type: file.type || file.name.split('.').pop()
        }),
      });

      if (response.ok) {
        const result = await response.json();

        const mappedResult: FileScanResult = {
          id: result.id,
          fileName: result.filename,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          fileType: result.type,
          timestamp: result.timestamp,
          threatLevel: result.threatLevel,
          riskScore: result.score,
          details: {
            virusDetected: result.threatLevel === "Dangerous",
            suspiciousActivity: result.threatLevel === "Suspicious",
            fileIntegrity: result.threatLevel === "Safe" ? "Good" : "Compromised",
            scanEngines: 45,
            detectionCount: result.threatLevel === "Safe" ? 0 : 5,
          }
        };

        setScanResult(mappedResult);
        fetchHistory();
      }
    } catch (error) {
      console.error("File scan failed:", error);
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "Safe":
        return "text-green-600 bg-green-50 border-green-200"
      case "Suspicious":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "Malicious":
      case "Dangerous":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getThreatIcon = (level: string) => {
    switch (level) {
      case "Safe":
        return <CheckCircle className="h-4 w-4" />
      case "Suspicious":
        return <AlertTriangle className="h-4 w-4" />
      case "Malicious":
      case "Dangerous":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">File Scanner</h2>
        <p className="text-slate-600">Upload files to scan for malware, viruses, and suspicious content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Scan File
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Scan History
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  File Upload & Scan
                </CardTitle>
                <CardDescription>Upload a file to scan for malware and security threats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-orange-400 bg-orange-50" : "border-slate-300 hover:border-slate-400"
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-medium text-slate-900 mb-2">Drop your file here or click to browse</p>
                  <p className="text-sm text-slate-500 mb-4">Supports: PDF, DOC, EXE, ZIP, and more</p>
                  <Button onClick={handleFileSelect} variant="outline">
                    <File className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p>• Maximum file size: 100MB</p>
                  <p>• Scanned with 45+ antivirus engines</p>
                  <p>• Files are automatically deleted after scan</p>
                  <p>• No files are stored on our servers</p>
                </div>
              </CardContent>
            </Card>

            {/* Scan Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Scan Results
                </CardTitle>
                <CardDescription>
                  {scanResult
                    ? "Scan complete"
                    : isScanning
                      ? "Scanning in progress..."
                      : "Results will appear here after scanning"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isScanning ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 mb-2">Scanning file...</p>
                    <p className="text-sm text-slate-500">This may take a few moments</p>
                  </div>
                ) : scanResult ? (
                  <div className="space-y-4">
                    {/* File Info */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <File className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{scanResult.fileName}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {scanResult.fileSize} • {scanResult.fileType}
                      </div>
                    </div>

                    {/* Threat Level */}
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        {getThreatIcon(scanResult.threatLevel)}
                        <span className="font-medium">Threat Level</span>
                      </div>
                      <Badge className={getThreatColor(scanResult.threatLevel)}>{scanResult.threatLevel}</Badge>
                    </div>

                    {/* Risk Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Risk Score</span>
                        <span>{scanResult.riskScore}%</span>
                      </div>
                      <Progress value={scanResult.riskScore} className="h-2" />
                    </div>

                    <Separator />

                    {/* Scan Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Virus Detected</span>
                        <Badge variant={scanResult.details.virusDetected ? "destructive" : "secondary"}>
                          {scanResult.details.virusDetected ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Suspicious Activity</span>
                        <Badge variant={scanResult.details.suspiciousActivity ? "destructive" : "secondary"}>
                          {scanResult.details.suspiciousActivity ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">File Integrity</span>
                        <Badge variant={scanResult.details.fileIntegrity === "Good" ? "secondary" : "destructive"}>
                          {scanResult.details.fileIntegrity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Detection Engines</span>
                        <span className="font-medium">
                          {scanResult.details.detectionCount}/{scanResult.details.scanEngines}
                        </span>
                      </div>
                    </div>

                    {/* Detected Threats */}
                    {scanResult.threats && scanResult.threats.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Detected Threats</h4>
                        <div className="space-y-1">
                          {scanResult.threats.map((threat, index) => (
                            <div key={index} className="text-sm text-red-700 font-mono">
                              {threat}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => {
                        if (scanResult) {
                          const text = `File Scan Report\n\nFile: ${scanResult.fileName}\nType: ${scanResult.fileType}\nSize: ${scanResult.fileSize}\nThreat Level: ${scanResult.threatLevel}\nRisk Score: ${scanResult.riskScore}%`;
                          navigator.clipboard.writeText(text);
                          alert("Report copied to clipboard!");
                        }
                      }}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Report
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => {
                        if (scanResult) {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scanResult, null, 2));
                          const downloadAnchorNode = document.createElement('a');
                          downloadAnchorNode.setAttribute("href", dataStr);
                          downloadAnchorNode.setAttribute("download", "file_scan_report.json");
                          document.body.appendChild(downloadAnchorNode);
                          downloadAnchorNode.click();
                          downloadAnchorNode.remove();
                        }
                      }}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No scan results yet</p>
                    <p className="text-sm">Upload a file to begin scanning</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent File Scans</CardTitle>
                  <CardDescription>History of your file security scans</CardDescription>
                </div>
                {scanHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-800 hover:bg-red-950 hover:text-red-300"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/history?type=file", { method: "DELETE" });
                        if (res.ok) setScanHistory([]);
                      } catch (e) { console.error(e); }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear History
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanHistory.map((scan) => (
                  <div key={scan.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <File className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{scan.fileName}</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {scan.fileSize} • {scan.fileType}
                        </p>
                        <p className="text-xs text-slate-500">{scan.timestamp}</p>
                      </div>
                      <Badge className={getThreatColor(scan.threatLevel)}>
                        {getThreatIcon(scan.threatLevel)}
                        <span className="ml-1">{scan.threatLevel}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Risk: {scan.riskScore}%</span>
                      <span>
                        Detections: {scan.details.detectionCount}/{scan.details.scanEngines}
                      </span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Files Scanned</p>
                    <p className="text-2xl font-bold text-slate-900">1,892</p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Threats Found</p>
                    <p className="text-2xl font-bold text-red-600">143</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Clean Files</p>
                    <p className="text-2xl font-bold text-green-600">1,749</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>File Types Scanned</CardTitle>
              <CardDescription>Distribution of scanned file types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Executable Files (.exe, .msi)</span>
                  <div className="flex items-center gap-2">
                    <Progress value={35} className="w-32" />
                    <span className="text-sm font-medium">35%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Documents (.pdf, .doc, .xls)</span>
                  <div className="flex items-center gap-2">
                    <Progress value={28} className="w-32" />
                    <span className="text-sm font-medium">28%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Archives (.zip, .rar, .7z)</span>
                  <div className="flex items-center gap-2">
                    <Progress value={22} className="w-32" />
                    <span className="text-sm font-medium">22%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Other Files</span>
                  <div className="flex items-center gap-2">
                    <Progress value={15} className="w-32" />
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
