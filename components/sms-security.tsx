"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Scan,
  History,
  TrendingUp,
  Eye,
  Copy,
  Download,
  Trash2,
} from "lucide-react"

interface SMSScanResult {
  id: string
  message: string
  sender: string
  timestamp: string
  threatLevel: "Safe" | "Suspicious" | "Spam"
  spamScore: number
  keywords: string[]
  category: "Promotional" | "Phishing" | "Scam" | "Legitimate" | "Unknown"
}

export function SMSSecurity() {
  const [activeTab, setActiveTab] = useState("scan")
  const [smsContent, setSmsContent] = useState("")
  const [senderNumber, setSenderNumber] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<SMSScanResult | null>(null)

  const [scanHistory, setScanHistory] = useState<SMSScanResult[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history?type=sms");
      if (res.ok) {
        const data = await res.json();
        // Map backend data to frontend interface
        const mappedData = data.map((item: any) => ({
          id: item.id,
          message: item.content || item.message || "",
          sender: item.sender || "Unknown",
          timestamp: item.timestamp,
          threatLevel: item.threatLevel,
          spamScore: item.score || item.spamScore || 0,
          keywords: item.keywords || [],
          // Derive category if missing
          category: item.category || (item.threatLevel === "Safe" ? "Legitimate" : "Scam")
        }));
        setScanHistory(mappedData);
      }
    } catch (error) {
      console.error("Error fetching SMS history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const handleScan = async () => {
    if (!smsContent.trim()) return

    setIsScanning(true)

    try {
      const response = await fetch("/api/scan/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: smsContent,
          sender: senderNumber
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Map backend result to frontend structure with defaults if missing
        const mappedResult: SMSScanResult = {
          id: result.id,
          message: result.content,
          sender: result.sender,
          timestamp: result.timestamp,
          threatLevel: result.threatLevel,
          spamScore: result.score,
          keywords: [],
          category: result.threatLevel === "Safe" ? "Legitimate" : "Scam"
        };

        setScanResult(mappedResult);
        fetchHistory();
      }
    } catch (error) {
      console.error("SMS analysis failed:", error);
    } finally {
      setIsScanning(false)
    }
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "Safe":
        return "text-green-400 bg-green-950/30 border-green-800"
      case "Suspicious":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-800"
      case "Spam":
      case "Dangerous":
        return "text-red-400 bg-red-950/30 border-red-800"
      default:
        return "text-slate-400 bg-slate-900 border-slate-700"
    }
  }

  const getThreatIcon = (level: string) => {
    switch (level) {
      case "Safe":
        return <CheckCircle className="h-4 w-4" />
      case "Suspicious":
        return <AlertTriangle className="h-4 w-4" />
      case "Spam":
      case "Dangerous":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">SMS Protection</h2>
        <p className="text-slate-400">Detect spam messages and analyze SMS content for threats</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-slate-900">
          <TabsTrigger value="scan" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Scan className="h-4 w-4" />
            Scan SMS
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <History className="h-4 w-4" />
            Scan History
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMS Input */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5 text-yellow-500" />
                  SMS Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">Enter SMS content to check for spam and suspicious patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sender" className="text-slate-200">Sender Number/Name (Optional)</Label>
                  <Input
                    id="sender"
                    placeholder="+1234567890 or SenderName"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-slate-200">SMS Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste the SMS message here..."
                    className="min-h-[150px] bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                    value={smsContent}
                    onChange={(e) => setSmsContent(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleScan}
                  disabled={!smsContent.trim() || isScanning}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isScanning ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Analyze SMS
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Scan Results */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Analysis Results
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {scanResult ? "Analysis complete" : "Results will appear here after scanning"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    {/* Threat Level */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-950">
                      <div className="flex items-center gap-2 text-white">
                        {getThreatIcon(scanResult.threatLevel)}
                        <span className="font-medium">Threat Level</span>
                      </div>
                      <Badge className={getThreatColor(scanResult.threatLevel)}>{scanResult.threatLevel}</Badge>
                    </div>

                    {/* Spam Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1 text-slate-300">
                        <span>Spam Score</span>
                        <span>{scanResult.spamScore}%</span>
                      </div>
                      <Progress value={scanResult.spamScore} className="h-2 bg-slate-800" />
                    </div>

                    <Separator className="bg-slate-800" />

                    {/* Category */}
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-medium">Category</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">{scanResult.category}</Badge>
                    </div>

                    {/* Keywords */}
                    {scanResult.keywords.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-slate-300">Suspicious Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {scanResult.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-slate-800 text-slate-300 hover:bg-slate-700">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => {
                        if (scanResult) {
                          const text = `SMS Analysis Report\n\nSender: ${scanResult.sender}\nMessage: ${scanResult.message}\nThreat Level: ${scanResult.threatLevel}\nSpam Score: ${scanResult.spamScore}%`;
                          navigator.clipboard.writeText(text);
                          alert("Report copied to clipboard!");
                        }
                      }}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Report
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => {
                        if (scanResult) {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scanResult, null, 2));
                          const downloadAnchorNode = document.createElement('a');
                          downloadAnchorNode.setAttribute("href", dataStr);
                          downloadAnchorNode.setAttribute("download", "sms_analysis_report.json");
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
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-700" />
                    <p>No analysis results yet</p>
                    <p className="text-sm">Enter SMS content and click analyze to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Recent SMS Scans</CardTitle>
                  <CardDescription className="text-slate-400">History of your SMS security analyses</CardDescription>
                </div>
                {scanHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-800 hover:bg-red-950 hover:text-red-300"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/history?type=sms", { method: "DELETE" });
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
                  <div key={scan.id} className="border border-slate-800 rounded-lg p-4 hover:bg-slate-800/50 transition-colors bg-slate-950">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {/* Fix: safely handle message and use light text color */}
                        <p className="text-sm text-slate-200 mb-1">{(scan.message || "").substring(0, 80)}...</p>
                        <p className="text-sm text-slate-400">From: {scan.sender}</p>
                        <p className="text-xs text-slate-500">{scan.timestamp}</p>
                      </div>
                      <Badge className={getThreatColor(scan.threatLevel)}>
                        {getThreatIcon(scan.threatLevel)}
                        <span className="ml-1">{scan.threatLevel}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Spam: {scan.spamScore}%</span>
                      <span>Category: {scan.category}</span>
                      <Button variant="ghost" size="sm" className="ml-auto text-blue-400 hover:text-blue-300">
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
                    <p className="text-sm text-slate-600">Total SMS Scanned</p>
                    <p className="text-2xl font-bold text-slate-900">892</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Spam Detected</p>
                    <p className="text-2xl font-bold text-red-600">156</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Safe Messages</p>
                    <p className="text-2xl font-bold text-green-600">736</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Spam Categories</CardTitle>
              <CardDescription>Distribution of detected spam types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Promotional Spam</span>
                  <div className="flex items-center gap-2">
                    <Progress value={45} className="w-32" />
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Phishing Attempts</span>
                  <div className="flex items-center gap-2">
                    <Progress value={30} className="w-32" />
                    <span className="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Prize/Lottery Scams</span>
                  <div className="flex items-center gap-2">
                    <Progress value={25} className="w-32" />
                    <span className="text-sm font-medium">25%</span>
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
