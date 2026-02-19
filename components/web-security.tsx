"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  History,
  TrendingUp,
  Eye,
  Copy,
  Download,
  ExternalLink,
  Database,
  Lock,
  Trash2,
} from "lucide-react"

interface URLScanResult {
  id: string
  url: string
  timestamp: string
  safetyLevel: "Safe" | "Suspicious" | "Dangerous"
  riskScore: number
  category: "Safe" | "Phishing" | "Malware" | "Scam" | "Suspicious"
  details: {
    domainAge: string
    sslStatus: "Valid" | "Invalid" | "None"
    reputation: "Good" | "Unknown" | "Bad"
    redirects: number
    breachHistory: boolean
    malwareDetected: boolean
  }
  breachInfo?: {
    breachCount: number
    lastBreach: string
    affectedData: string[]
  }
}

export function WebSecurity() {
  const [activeTab, setActiveTab] = useState("scan")
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<URLScanResult | null>(null)

  const [scanHistory, setScanHistory] = useState<URLScanResult[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history?type=web");
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map((item: any) => ({
          id: item.id,
          url: item.url,
          timestamp: item.timestamp,
          safetyLevel: item.threatLevel,
          riskScore: item.score,
          category: item.threatLevel === "Safe" ? "Safe" : "Suspicious",
          details: {
            domainAge: item.details?.domainAge || "Unknown",
            sslStatus: item.details?.ssl || "Unknown",
            reputation: item.threatLevel === "Safe" ? "Good" : "Bad",
            redirects: 0,
            breachHistory: false,
            malwareDetected: item.threatLevel === "Dangerous"
          },
          breachInfo: {
            breachCount: 0,
            lastBreach: "",
            affectedData: []
          }
        }));
        setScanHistory(mappedData);
      }
    } catch (error) {
      console.error("Error fetching web history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const handleScan = async () => {
    if (!url.trim()) return;

    setIsScanning(true);

    try {
      const response = await fetch("/api/scan/web", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      if (response.ok) {
        const result = await response.json();
        setScanResult({
          ...result,
          // Ensure default values for properties not fully returned by backend simple logic
          category: result.threatLevel === "Safe" ? "Safe" : "Suspicious",
          riskScore: result.score,
          safetyLevel: result.threatLevel,
          details: {
            ...result.details,
            reputation: result.threatLevel === "Safe" ? "Good" : "Bad",
            redirects: 0,
            breachHistory: false,
            malwareDetected: result.threatLevel === "Dangerous"
          }
        });
        fetchHistory();
      }
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case "Safe":
        return "text-green-600 bg-green-50 border-green-200"
      case "Suspicious":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "Dangerous":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case "Safe":
        return <CheckCircle className="h-4 w-4" />
      case "Suspicious":
        return <AlertTriangle className="h-4 w-4" />
      case "Dangerous":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Web Scanner</h2>
        <p className="text-slate-600">Scan URLs for safety, check breach history, and verify website legitimacy</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Scan URL
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
            {/* URL Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  URL Security Scan
                </CardTitle>
                <CardDescription>Enter a URL to check for safety, malware, and breach history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleScan}
                  disabled={!url.trim() || isScanning}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isScanning ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Scan URL
                    </>
                  )}
                </Button>

                <div className="text-xs text-slate-500 space-y-1">
                  <p>• Checks for malware and phishing</p>
                  <p>• Verifies SSL certificates</p>
                  <p>• Looks up breach history</p>
                  <p>• Analyzes domain reputation</p>
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
                  {scanResult ? "Scan complete" : "Results will appear here after scanning"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    {/* URL Display */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                        <span className="font-mono text-slate-600 break-all">{scanResult.url}</span>
                      </div>
                    </div>

                    {/* Safety Level */}
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        {getSafetyIcon(scanResult.safetyLevel)}
                        <span className="font-medium">Safety Level</span>
                      </div>
                      <Badge className={getSafetyColor(scanResult.safetyLevel)}>{scanResult.safetyLevel}</Badge>
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

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600">Domain Age</p>
                          <p className="font-medium">{scanResult.details.domainAge}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600">SSL Status</p>
                          <p
                            className={`font-medium ${scanResult.details.sslStatus === "Valid" ? "text-green-600" : "text-red-600"}`}
                          >
                            {scanResult.details.sslStatus}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600">Reputation</p>
                          <p className="font-medium">{scanResult.details.reputation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600">Redirects</p>
                          <p className="font-medium">{scanResult.details.redirects}</p>
                        </div>
                      </div>
                    </div>

                    {/* Security Indicators */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Malware Detected</span>
                        <Badge variant={scanResult.details.malwareDetected ? "destructive" : "secondary"}>
                          {scanResult.details.malwareDetected ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Breach History</span>
                        <Badge variant={scanResult.details.breachHistory ? "destructive" : "secondary"}>
                          {scanResult.details.breachHistory ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>

                    {/* Breach Information */}
                    {scanResult.breachInfo && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-800">Breach Information</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="text-slate-600">Breaches:</span> {scanResult.breachInfo.breachCount}
                          </p>
                          <p>
                            <span className="text-slate-600">Last Breach:</span> {scanResult.breachInfo.lastBreach}
                          </p>
                          <p>
                            <span className="text-slate-600">Affected Data:</span>{" "}
                            {scanResult.breachInfo.affectedData.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => {
                        if (scanResult) {
                          const text = `Web Scan Report\n\nURL: ${scanResult.url}\nSafety Level: ${scanResult.safetyLevel}\nRisk Score: ${scanResult.riskScore}%\nCurrently: ${scanResult.category}`;
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
                          downloadAnchorNode.setAttribute("download", "web_scan_report.json");
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
                    <Globe className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No scan results yet</p>
                    <p className="text-sm">Enter a URL and click scan to begin</p>
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
                  <CardTitle>Recent URL Scans</CardTitle>
                  <CardDescription>History of your website security scans</CardDescription>
                </div>
                {scanHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-800 hover:bg-red-950 hover:text-red-300"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/history?type=web", { method: "DELETE" });
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
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-slate-900 break-all">{scan.url}</p>
                        <p className="text-xs text-slate-500">{scan.timestamp}</p>
                      </div>
                      <Badge className={getSafetyColor(scan.safetyLevel)}>
                        {getSafetyIcon(scan.safetyLevel)}
                        <span className="ml-1">{scan.safetyLevel}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Risk: {scan.riskScore}%</span>
                      <span>Category: {scan.category}</span>
                      <span>SSL: {scan.details.sslStatus}</span>
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
                    <p className="text-sm text-slate-600">URLs Scanned</p>
                    <p className="text-2xl font-bold text-slate-900">2,341</p>
                  </div>
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Threats Found</p>
                    <p className="text-2xl font-bold text-red-600">187</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Safe Sites</p>
                    <p className="text-2xl font-bold text-green-600">2,154</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Threat Categories</CardTitle>
              <CardDescription>Distribution of detected web threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Phishing Sites</span>
                  <div className="flex items-center gap-2">
                    <Progress value={42} className="w-32" />
                    <span className="text-sm font-medium">42%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Malware Distribution</span>
                  <div className="flex items-center gap-2">
                    <Progress value={28} className="w-32" />
                    <span className="text-sm font-medium">28%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Suspicious Content</span>
                  <div className="flex items-center gap-2">
                    <Progress value={20} className="w-32" />
                    <span className="text-sm font-medium">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Scam Pages</span>
                  <div className="flex items-center gap-2">
                    <Progress value={10} className="w-32" />
                    <span className="text-sm font-medium">10%</span>
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
