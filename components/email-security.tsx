"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Scan,
  History,
  TrendingUp,
  Eye,
  Copy,
  Download,
  Trash2,
} from "lucide-react";

interface EmailScanResult {
  id: string;
  subject: string;
  sender: string;
  timestamp: string;
  threatLevel: "Safe" | "Suspicious" | "Dangerous";
  spamScore: number;
  phishingScore: number;
  summary: string;
  details: {
    suspiciousLinks: number;
    attachments: number;
    senderReputation: "Good" | "Unknown" | "Bad";
    domainAge: string;
  };
}

export function EmailSecurity() {
  const [activeTab, setActiveTab] = useState("scan");
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<EmailScanResult | null>(null);

  const [scanHistory, setScanHistory] = useState<EmailScanResult[]>([]);
  const [stats, setStats] = useState({ total: 0, threats: 0, safe: 0 });

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setScanHistory(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [activeTab]);

  const handleScan = async () => {
    if (!emailContent.trim()) return;

    setIsScanning(true);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: emailContent,
          subject: emailSubject,
          sender: senderEmail,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setScanResult(result);
        fetchHistory(); // Update history immediately
        fetchStats();   // Update stats immediately
      } else {
        console.error("Scan failed");
      }
    } catch (error) {
      console.error("Error scanning email:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "Safe":
        return "text-green-600 bg-green-50 border-green-200";
      case "Suspicious":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Dangerous":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case "Safe":
        return <CheckCircle className="h-4 w-4" />;
      case "Suspicious":
        return <AlertTriangle className="h-4 w-4" />;
      case "Dangerous":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Email Security
        </h2>
        <p className="text-slate-600">
          Detect spam, phishing attempts, and analyze email content for threats
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Scan Email
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
            {/* Email Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Email Analysis
                </CardTitle>
                <CardDescription>
                  Paste your email content below to scan for spam and phishing
                  attempts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject line"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender">Sender Email (Optional)</Label>
                  <Input
                    id="sender"
                    placeholder="sender@example.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste the email content here..."
                    className="min-h-[200px]"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleScan}
                  disabled={!emailContent.trim() || isScanning}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isScanning ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Scan Email
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Scan Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Scan Results
                </CardTitle>
                <CardDescription>
                  {scanResult
                    ? "Analysis complete"
                    : "Results will appear here after scanning"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    {/* Threat Level */}
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        {getThreatIcon(scanResult.threatLevel)}
                        <span className="font-medium">Threat Level</span>
                      </div>
                      <Badge className={getThreatColor(scanResult.threatLevel)}>
                        {scanResult.threatLevel}
                      </Badge>
                    </div>

                    {/* Scores */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Spam Score</span>
                          <span>{scanResult.spamScore}%</span>
                        </div>
                        <Progress
                          value={scanResult.spamScore}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Phishing Score</span>
                          <span>{scanResult.phishingScore}%</span>
                        </div>
                        <Progress
                          value={scanResult.phishingScore}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Summary */}
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-slate-600">
                        {scanResult.summary}
                      </p>
                    </div>

                    {/* Details */}
                    <div>
                      <h4 className="font-medium mb-2">Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">
                            Suspicious Links:
                          </span>
                          <span>{scanResult.details.suspiciousLinks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Attachments:</span>
                          <span>{scanResult.details.attachments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sender Rep:</span>
                          <span>{scanResult.details.senderReputation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Domain Age:</span>
                          <span>{scanResult.details.domainAge}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          if (scanResult) {
                            const text = `Email Scan Report\n\nSubject: ${scanResult.subject}\nSender: ${scanResult.sender}\nThreat Level: ${scanResult.threatLevel}\n\nSummary: ${scanResult.summary}`;
                            navigator.clipboard.writeText(text);
                            alert("Report copied to clipboard!");
                          }
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Report
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          if (scanResult) {
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scanResult, null, 2));
                            const downloadAnchorNode = document.createElement('a');
                            downloadAnchorNode.setAttribute("href", dataStr);
                            downloadAnchorNode.setAttribute("download", "scan_report.json");
                            document.body.appendChild(downloadAnchorNode); // required for firefox
                            downloadAnchorNode.click();
                            downloadAnchorNode.remove();
                          }
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Mail className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No scan results yet</p>
                    <p className="text-sm">
                      Enter email content and click scan to begin
                    </p>
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
                  <CardTitle>Recent Scans</CardTitle>
                  <CardDescription>
                    History of your email security scans
                  </CardDescription>
                </div>
                {scanHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-800 hover:bg-red-950 hover:text-red-300"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/history?type=email", { method: "DELETE" });
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
                  <div
                    key={scan.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">
                          {scan.subject}
                        </h4>
                        <p className="text-sm text-slate-600">
                          From: {scan.sender}
                        </p>
                        <p className="text-xs text-slate-500">
                          {scan.timestamp}
                        </p>
                      </div>
                      <Badge className={getThreatColor(scan.threatLevel)}>
                        {getThreatIcon(scan.threatLevel)}
                        <span className="ml-1">{scan.threatLevel}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {scan.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Spam: {scan.spamScore}%</span>
                      <span>Phishing: {scan.phishingScore}%</span>
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
                    <p className="text-sm text-slate-600">Total Scans</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  </div>
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Threats Detected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.threats}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Safe Emails</p>
                    <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Threat Distribution</CardTitle>
              <CardDescription>
                Breakdown of detected threats over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Phishing Attempts
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="w-32" />
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Spam Messages</span>
                  <div className="flex items-center gap-2">
                    <Progress value={25} className="w-32" />
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Malicious Attachments
                  </span>
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
  );
}
