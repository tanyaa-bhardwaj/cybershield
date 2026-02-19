"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Shield, AlertTriangle, CheckCircle, Clock, Search, History, TrendingUp, Eye, Flag, Copy, Download, Trash2 } from "lucide-react"

interface PhoneCheckResult {
  id: string
  phoneNumber: string
  timestamp: string
  riskLevel: "Safe" | "Suspicious" | "Dangerous"
  riskScore: number
  reports: number
  category: "Telemarketer" | "Scam" | "Robocall" | "Legitimate" | "Unknown"
  location: string
  carrier: string
  details: {
    recentReports: number
    commonComplaints: string[]
    blockedBy: number
  }
}

interface ScamReport {
  id: string
  phoneNumber: string
  reportedBy: string
  timestamp: string
  category: string
  description: string
  verified: boolean
}

export function PhoneSecurity() {
  const [activeTab, setActiveTab] = useState("check")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<PhoneCheckResult | null>(null)

  // Report form state
  const [reportNumber, setReportNumber] = useState("")
  const [reportCategory, setReportCategory] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  const [checkHistory, setCheckHistory] = useState<PhoneCheckResult[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history?type=phone");
      if (res.ok) {
        const data = await res.json();
        const mappedData = data.map((item: any) => ({
          id: item.id,
          phoneNumber: item.number,
          timestamp: item.timestamp,
          riskLevel: item.threatLevel,
          riskScore: item.score,
          reports: item.details?.reports || 0,
          category: item.details?.category || "Unknown",
          location: item.details?.location || "Unknown",
          carrier: item.details?.carrier || "Unknown",
          details: {
            recentReports: 0,
            commonComplaints: [],
            blockedBy: 0,
          }
        }));
        setCheckHistory(mappedData);
      }
    } catch (error) {
      console.error("Error fetching phone history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  // Remove dummy reports
  const [recentReports, setRecentReports] = useState<ScamReport[]>([]);

  const formatPhoneNumber = (value: string) => {
    // Digits only
    const clean = value.replace(/\D/g, "");
    // Truncate to 10 digits
    const truncated = clean.substring(0, 10);
    // Format as (XXX) XXX-XXXX
    if (truncated.length < 4) return truncated;
    if (truncated.length < 7) return `(${truncated.substring(0, 3)}) ${truncated.substring(3)}`;
    return `(${truncated.substring(0, 3)}) ${truncated.substring(3, 6)}-${truncated.substring(6)}`;
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setter(formatted);
  };

  const handleCheck = async () => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (!cleanNumber) return

    setIsChecking(true)

    try {
      const response = await fetch("/api/scan/phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: phoneNumber }), // Backend handles cleaning too, but good to send formatted or clean
      });

      if (response.ok) {
        const result = await response.json();

        const mappedResult: PhoneCheckResult = {
          id: result.id,
          phoneNumber: result.number,
          timestamp: result.timestamp,
          riskLevel: result.threatLevel,
          riskScore: result.score,
          reports: result.details?.reports || 0,
          category: result.details?.category || "Unknown",
          location: result.details?.location || "Unknown",
          carrier: result.details?.carrier || "Unknown",
          details: {
            recentReports: 0,
            commonComplaints: [],
            blockedBy: 0,
          }
        };

        setCheckResult(mappedResult);
        fetchHistory();
      }
    } catch (error) {
      console.error("Phone check failed:", error);
    } finally {
      setIsChecking(false)
    }
  }

  const handleReport = async () => {
    if (!reportNumber || !reportCategory) return;

    try {
      const response = await fetch("/api/report/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: reportNumber,
          category: reportCategory,
          description: reportDescription
        })
      });

      if (response.ok) {
        alert("Thank you! Report submitted and database updated.");
        setReportNumber("");
        setReportCategory("");
        setReportDescription("");
        // Refresh history/stats if needed
        fetchHistory();
      } else {
        alert("Failed to submit report.");
      }
    } catch (e) {
      console.error("Report failed", e);
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Safe":
        return "text-green-400 bg-green-950/30 border-green-800"
      case "Suspicious":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-800"
      case "Dangerous":
        return "text-red-400 bg-red-950/30 border-red-800"
      default:
        return "text-slate-400 bg-slate-900 border-slate-700"
    }
  }

  const getRiskIcon = (level: string) => {
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
        <h2 className="text-3xl font-bold text-white mb-2">Phone Security</h2>
        <p className="text-slate-400">Check phone numbers for scam reports and verify caller legitimacy</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-900">
          <TabsTrigger value="check" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Search className="h-4 w-4" />
            Check Number
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Flag className="h-4 w-4" />
            Report Scam
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <History className="h-4 w-4" />
            Check History
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="check" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phone Check Input */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Phone className="h-5 w-5 text-red-500" />
                  Phone Number Lookup
                </CardTitle>
                <CardDescription className="text-slate-400">Enter a phone number to check for scam reports and caller information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-200">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneInput(e, setPhoneNumber)}
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  />
                  <p className="text-xs text-slate-500">Format: (XXX) XXX-XXXX</p>
                </div>

                <Button
                  onClick={handleCheck}
                  disabled={!phoneNumber.trim() || isChecking}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {isChecking ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Check Number
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Check Results */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Lookup Results
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {checkResult ? "Check complete" : "Results will appear here after checking"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {checkResult ? (
                  <div className="space-y-4">
                    {/* Risk Level */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-950">
                      <div className="flex items-center gap-2 text-white">
                        {getRiskIcon(checkResult.riskLevel)}
                        <span className="font-medium">Risk Level</span>
                      </div>
                      <Badge className={getRiskColor(checkResult.riskLevel)}>{checkResult.riskLevel}</Badge>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                      <div>
                        <span className="text-slate-500">Reports:</span>
                        <span className="ml-2 font-medium text-white">{checkResult.reports}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Category:</span>
                        <span className="ml-2 font-medium text-white">{checkResult.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Location:</span>
                        <span className="ml-2 font-medium text-white">{checkResult.location}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Carrier:</span>
                        <span className="ml-2 font-medium text-white">{checkResult.carrier}</span>
                      </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    {/* Details */}
                    <div className="text-slate-300">
                      <h4 className="font-medium mb-2 text-white">Additional Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Recent Reports:</span>
                          <span>{checkResult.reports > 0 ? checkResult.reports : 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => {
                        if (checkResult) {
                          const text = `Phone Check Report\n\nNumber: ${checkResult.phoneNumber}\nRisk Level: ${checkResult.riskLevel}\nScore: ${checkResult.riskScore}\nCategory: ${checkResult.category}`;
                          navigator.clipboard.writeText(text);
                          alert("Report copied to clipboard!");
                        }
                      }}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Report
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => {
                        if (checkResult) {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(checkResult, null, 2));
                          const downloadAnchorNode = document.createElement('a');
                          downloadAnchorNode.setAttribute("href", dataStr);
                          downloadAnchorNode.setAttribute("download", "phone_check_report.json");
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
                    <Phone className="h-12 w-12 mx-auto mb-3 text-slate-700" />
                    <p>No lookup results yet</p>
                    <p className="text-sm">Enter a phone number and click check to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Flag className="h-5 w-5 text-orange-500" />
                  Report Scam Number
                </CardTitle>
                <CardDescription className="text-slate-400">Help protect others by reporting scam or suspicious phone numbers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-phone" className="text-slate-200">Phone Number</Label>
                  <Input
                    id="report-phone"
                    placeholder="(555) 123-4567"
                    value={reportNumber}
                    onChange={(e) => handlePhoneInput(e, setReportNumber)}
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-200">Scam Category</Label>
                  <select
                    className="w-full p-2 border border-slate-700 rounded-md bg-slate-950 text-white"
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                  >
                    <option value="">Select category...</option>
                    <option value="IRS Scam">IRS Scam</option>
                    <option value="Tech Support">Tech Support Scam</option>
                    <option value="Robocall">Robocall</option>
                    <option value="Telemarketer">Unwanted Telemarketer</option>
                    <option value="Identity Theft">Identity Theft</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-200">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happened during the call..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>

                <Button
                  onClick={handleReport}
                  disabled={!reportNumber.trim() || !reportCategory || !reportDescription.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Submit Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Community Reports</CardTitle>
                <CardDescription className="text-slate-400">Latest scam reports from other users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.length > 0 ? recentReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{report.phoneNumber}</p>
                          <p className="text-xs text-slate-500">Reported by {report.reportedBy}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {report.category}
                          </Badge>
                          {report.verified && <Badge className="text-xs bg-green-100 text-green-700">Verified</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{report.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{report.timestamp}</p>
                    </div>
                  )) : (
                    <div className="text-center text-slate-500 py-4">No recent reports to display.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Phone Checks</CardTitle>
                  <CardDescription>History of your phone number lookups</CardDescription>
                </div>
                {checkHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-800 hover:bg-red-950 hover:text-red-300"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/history?type=phone", { method: "DELETE" });
                        if (res.ok) setCheckHistory([]);
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
                {checkHistory.map((check) => (
                  <div key={check.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{check.phoneNumber}</p>
                        <p className="text-sm text-slate-600">
                          {check.location} • {check.carrier}
                        </p>
                        <p className="text-xs text-slate-500">{check.timestamp}</p>
                      </div>
                      <Badge className={getRiskColor(check.riskLevel)}>
                        {getRiskIcon(check.riskLevel)}
                        <span className="ml-1">{check.riskLevel}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Reports: {check.reports}</span>
                      <span>Category: {check.category}</span>
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
                    <p className="text-sm text-slate-600">Numbers Checked</p>
                    <p className="text-2xl font-bold text-slate-900">1,456</p>
                  </div>
                  <Phone className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Scams Identified</p>
                    <p className="text-2xl font-bold text-red-600">234</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Reports Submitted</p>
                    <p className="text-2xl font-bold text-orange-600">67</p>
                  </div>
                  <Flag className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scam Categories</CardTitle>
              <CardDescription>Distribution of identified scam types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">IRS/Tax Scams</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Tech Support Scams</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Robocalls</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "22%" }}></div>
                    </div>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Other Scams</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  )
}
