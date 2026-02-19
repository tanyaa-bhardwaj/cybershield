"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Mail,
  MessageSquare,
  Phone,
  Globe,
  FileText,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Users,
  Settings,
  Bell,
} from "lucide-react";
import { EmailSecurity } from "@/components/email-security";
import { SMSSecurity } from "@/components/sms-security";
import { PhoneSecurity } from "@/components/phone-security";
import { WebSecurity } from "@/components/web-security";
import { FileSecurity } from "@/components/file-security";
import Education from "@/components/education";
import Analytics from "@/components/analytics";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeModule, setActiveModule] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    {
      id: "overview",
      name: "Overview",
      icon: Shield,
      color: "text-blue-600",
      description: "Security dashboard",
    },
    {
      id: "email",
      name: "Email Security",
      icon: Mail,
      color: "text-green-600",
      description: "Spam & phishing detection",
    },
    {
      id: "sms",
      name: "SMS Protection",
      icon: MessageSquare,
      color: "text-yellow-600",
      description: "SMS spam filtering",
    },
    {
      id: "phone",
      name: "Phone Security",
      icon: Phone,
      color: "text-red-600",
      description: "Scam caller detection",
    },
    {
      id: "web",
      name: "Web Scanner",
      icon: Globe,
      color: "text-purple-600",
      description: "URL & breach lookup",
    },
    {
      id: "files",
      name: "File Scanner",
      icon: FileText,
      color: "text-orange-600",
      description: "Malware detection",
    },
    // Added Education and Analytics modules
    {
      id: "education",
      name: "Education",
      icon: BookOpen,
      color: "text-indigo-600",
      description: "Security awareness",
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: BarChart3,
      color: "text-teal-600",
      description: "Security insights",
    },
  ];

  const recentAlerts = [
    {
      type: "warning",
      message: "Suspicious email from unknown sender detected",
      time: "2 minutes ago",
      severity: "Medium",
    },
    {
      type: "success",
      message: "URL scan completed - site is safe to visit",
      time: "5 minutes ago",
      severity: "Low",
    },
    {
      type: "danger",
      message: "Potential phishing attempt blocked",
      time: "15 minutes ago",
      severity: "High",
    },
    {
      type: "info",
      message: "Weekly security report generated",
      time: "1 hour ago",
      severity: "Info",
    },
    {
      type: "warning",
      message: "Suspicious SMS pattern detected",
      time: "2 hours ago",
      severity: "Medium",
    },
  ];

  const stats = [
    {
      label: "Threats Blocked",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Shield,
      color: "text-white",
    },
    {
      label: "Emails Scanned",
      value: "3,891",
      change: "+8%",
      trend: "up",
      icon: Mail,
      color: "text-white",
    },
    {
      label: "URLs Verified",
      value: "567",
      change: "+15%",
      trend: "up",
      icon: Globe,
      color: "text-white",
    },
    {
      label: "Files Checked",
      value: "234",
      change: "+3%",
      trend: "up",
      icon: FileText,
      color: "text-white",
    },
  ];

  const securityScore = 87;
  const threatLevel = "Low";
  const threatLevelColor =
    threatLevel === "Low"
      ? "text-green-600"
      : threatLevel === "Medium"
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-bold text-white">CyberShield v2</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${threatLevel === "Low"
                    ? "bg-green-500"
                    : threatLevel === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                    }`}
                />
                <span className="text-slate-400">Threat Level:</span>
                <span className={`font-medium ${threatLevelColor}`}>
                  {threatLevel}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4 bg-slate-800" />
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Security Score:</span>
                <span className="font-medium text-blue-400">
                  {securityScore}%
                </span>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="relative text-white">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>

            <Button variant="ghost" size="sm" className="text-white">
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center gap-2 bg-transparent border-slate-700 text-white hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out`}
        >
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg">
              <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white">John Doe</p>
                <p className="text-sm text-slate-400">Premium User</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Security Modules
              </h3>
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group ${activeModule === module.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors ${activeModule === module.id
                        ? "text-white"
                        : module.color
                        } group-hover:scale-110`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{module.name}</div>
                      <div className="text-xs opacity-70">
                        {module.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-full overflow-hidden bg-slate-950">
          {activeModule === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Security Overview
                  </h2>
                  <p className="text-slate-400 mt-1">
                    Monitor your cybersecurity status across all modules
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-16 h-16">
                          <svg
                            className="w-16 h-16 transform -rotate-90"
                            viewBox="0 0 36 36"
                          >
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#1e293b"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeDasharray={`${securityScore}, 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                              {securityScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Security Score</p>
                        <p className="text-lg font-semibold text-white">
                          Excellent
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow bg-slate-900 border-slate-800"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Icon className="h-8 w-8 text-slate-500" />
                          <Badge
                            variant="secondary"
                            className="text-green-400 bg-green-950/30 border-green-900/50"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {stat.change}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-bold text-white">
                            {stat.value}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Alerts */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Alerts</CardTitle>
                        <CardDescription>
                          Latest security notifications and updates
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAlerts.slice(0, 4).map((alert, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="mt-0.5">
                            {alert.type === "warning" && (
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            )}
                            {alert.type === "success" && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {alert.type === "danger" && (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                            {alert.type === "info" && (
                              <Clock className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 mb-1">
                              {alert.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-slate-500">
                                {alert.time}
                              </p>
                              <Badge
                                variant="outline"
                                className={`text-xs ${alert.severity === "High"
                                  ? "border-red-200 text-red-700"
                                  : alert.severity === "Medium"
                                    ? "border-yellow-200 text-yellow-700"
                                    : alert.severity === "Low"
                                      ? "border-green-200 text-green-700"
                                      : "border-blue-200 text-blue-700"
                                  }`}
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Access your most used security tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {modules.slice(1, 5).map((module) => {
                        const Icon = module.icon;
                        return (
                          <Button
                            key={module.id}
                            variant="outline"
                            onClick={() => setActiveModule(module.id)}
                            className="h-24 flex-col gap-2 hover:bg-slate-50 transition-colors"
                          >
                            <Icon className={`h-8 w-8 ${module.color}`} />
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {module.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {module.description}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>System Activity</CardTitle>
                    <CardDescription>
                      Real-time security monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium">
                            All systems operational
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          Active
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Email Protection
                          </span>
                          <Progress value={95} className="w-24" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Web Scanner
                          </span>
                          <Progress value={88} className="w-24" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            File Scanner
                          </span>
                          <Progress value={92} className="w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Today's Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          24
                        </div>
                        <div className="text-sm text-slate-600">
                          Threats Blocked
                        </div>
                      </div>
                      <Separator />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          156
                        </div>
                        <div className="text-sm text-slate-600">
                          Scans Completed
                        </div>
                      </div>
                      <Separator />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-600">
                          0
                        </div>
                        <div
                          className="text-sm text-slate-600
                        "
                        >
                          Critical Issues
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeModule === "email" && <EmailSecurity />}
          {activeModule === "sms" && <SMSSecurity />}
          {activeModule === "phone" && <PhoneSecurity />}
          {activeModule === "web" && <WebSecurity />}
          {activeModule === "files" && <FileSecurity />}
          {activeModule === "education" && <Education />}
          {activeModule === "analytics" && <Analytics />}

          {activeModule !== "overview" &&
            activeModule !== "email" &&
            activeModule !== "sms" &&
            activeModule !== "phone" &&
            activeModule !== "web" &&
            activeModule !== "files" &&
            activeModule !== "education" &&
            activeModule !== "analytics" && (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  {(() => {
                    const module = modules.find((m) => m.id === activeModule);
                    const Icon = module?.icon || Shield;
                    return (
                      <Icon
                        className={`h-16 w-16 ${module?.color || "text-slate-400"
                          }`}
                      />
                    );
                  })()}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {modules.find((m) => m.id === activeModule)?.name} Module
                </h2>
                <p className="text-slate-600 mb-4">
                  {modules.find((m) => m.id === activeModule)?.description}
                </p>
                <p className="text-slate-500 mb-4">
                  This module is under development and will be available soon.
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className={cn("fixed inset-0 bg-black/60 z-40 lg:hidden")}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
