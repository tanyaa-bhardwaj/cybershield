"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  Mail,
  MessageSquare,
  Phone,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  Activity,
  Download,
} from "lucide-react"

// Dummy data removed. Relying on API.

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalyticsData(data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  const totalThreats = analyticsData?.totalThreats || 0;
  const totalBlocked = analyticsData?.totalBlocked || 0;
  const overallSuccessRate = analyticsData?.successRate || 0;

  const moduleStats = analyticsData?.modules || [
    { name: "Email Security", scanned: 0, threats: 0, blocked: 0 },
    { name: "Web Scanner", scanned: 0, threats: 0, blocked: 0 },
    { name: "SMS Protection", scanned: 0, threats: 0, blocked: 0 },
    { name: "Phone Security", scanned: 0, threats: 0, blocked: 0 },
    { name: "File Scanner", scanned: 0, threats: 0, blocked: 0 },
  ];

  // Helper to map module name to Icon and Color
  const getModuleConfig = (name: string) => {
    switch (name) {
      case "Email Security": return { icon: Mail, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" };
      case "SMS Protection": return { icon: MessageSquare, color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
      case "Phone Security": return { icon: Phone, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
      case "Web Scanner": return { icon: Globe, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" };
      case "File Scanner": return { icon: FileText, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" };
      default: return { icon: Shield, color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-teal-600" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Security Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your cybersecurity performance</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Module Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Total Threats</p>
                    <p className="text-3xl font-bold text-white">{totalThreats.toLocaleString()}</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Threats Blocked</p>
                    <p className="text-3xl font-bold text-white">{totalBlocked.toLocaleString()}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-white">{overallSuccessRate}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Stats */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Threat Distribution by Module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleStats.map((module: any, index: number) => {
                  const config = getModuleConfig(module.name);
                  const Icon = config.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${config.bgColor} bg-opacity-20`}>
                          <Icon className={`h-6 w-6 ${config.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-white">{module.name}</p>
                          <p className="text-sm text-slate-400">{module.scanned} Scanned</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-400">{module.threats} Threats</p>
                        <p className="text-sm text-green-400">{module.blocked} Blocked</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid gap-6">
            {moduleStats.map((module: any, index: number) => {
              const config = getModuleConfig(module.name);
              const Icon = config.icon;
              return (
                <Card key={index} className={`border-l-4 ${config.borderColor}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`h-6 w-6 ${config.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{module.name}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{module.scanned.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Items Scanned</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{module.threats}</p>
                        <p className="text-sm text-gray-600">Threats Found</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{module.blocked}</p>
                        <p className="text-sm text-gray-600">Threats Blocked</p>
                      </div>
                      <div className="text-center">
                        {/* Calculating a simple success rate if threats > 0 */}
                        <p className="text-2xl font-bold text-blue-600">
                          {module.threats > 0 ? ((module.blocked / module.threats) * 100).toFixed(1) : 100}%
                        </p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
