"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Shield,
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";

const glossaryTerms = [
  {
    term: "Phishing",
    definition:
      "A cyber attack that uses disguised email as a weapon to trick recipients into clicking malicious links or downloading infected attachments.",
    category: "Email Threats",
  },
  {
    term: "Malware",
    definition:
      "Malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.",
    category: "File Threats",
  },
  {
    term: "Spam",
    definition:
      "Unwanted or unsolicited messages sent over the internet, typically to large numbers of users.",
    category: "Communication",
  },
  {
    term: "Social Engineering",
    definition:
      "The use of deception to manipulate individuals into divulging confidential information or performing actions that compromise security.",
    category: "Human Factors",
  },
  {
    term: "Two-Factor Authentication",
    definition:
      "A security process that requires users to provide two different authentication factors to verify their identity.",
    category: "Security Measures",
  },
  {
    term: "Ransomware",
    definition:
      "A type of malware that encrypts files and demands payment for the decryption key.",
    category: "File Threats",
  },
  {
    term: "SSL Certificate",
    definition:
      "A digital certificate that authenticates a website's identity and enables an encrypted connection.",
    category: "Web Security",
  },
  {
    term: "Firewall",
    definition:
      "A network security system that monitors and controls incoming and outgoing network traffic.",
    category: "Network Security",
  },
];

const safetyTips = [
  {
    category: "Email Security",
    tips: [
      "Never click on suspicious links in emails",
      "Verify sender identity before responding to requests",
      "Check for spelling and grammar errors in emails",
      "Be cautious of urgent or threatening language",
      "Use email filters and spam detection",
    ],
  },
  {
    category: "Password Security",
    tips: [
      "Use strong, unique passwords for each account",
      "Enable two-factor authentication when available",
      "Use a reputable password manager",
      "Never share passwords with others",
      "Change passwords regularly",
    ],
  },
  {
    category: "Web Browsing",
    tips: [
      "Look for HTTPS and SSL certificates",
      "Avoid downloading from untrusted sources",
      "Keep browsers and plugins updated",
      "Use reputable antivirus software",
      "Be cautious on public Wi-Fi networks",
    ],
  },
  {
    category: "Mobile Security",
    tips: [
      "Download apps only from official stores",
      "Review app permissions before installing",
      "Keep your device's OS updated",
      "Use screen locks and biometric authentication",
      "Be cautious of SMS links and attachments",
    ],
  },
];

const threatExamples = [
  {
    type: "Phishing Email",
    example:
      "Urgent: Your account will be suspended unless you verify your information immediately.",
    redFlags: [
      "Urgent language",
      "Suspicious sender",
      "Generic greeting",
      "Suspicious links",
    ],
    severity: "High",
  },
  {
    type: "Scam SMS",
    example:
      "Congratulations! You've won $1000. Click here to claim your prize now!",
    redFlags: [
      "Too good to be true",
      "Unknown sender",
      "Suspicious links",
      "Urgency",
    ],
    severity: "Medium",
  },
  {
    type: "Fake Website",
    example:
      "A website that looks identical to your bank but has a slightly different URL",
    redFlags: [
      "No SSL certificate",
      "Misspelled URL",
      "Poor design quality",
      "Requests sensitive info",
    ],
    severity: "High",
  },
  {
    type: "Malicious File",
    example:
      "invoice_urgent.exe - A file disguised as a document but actually executable",
    redFlags: [
      "Unexpected file type",
      "Unknown sender",
      "Suspicious name",
      "No virus scan",
    ],
    severity: "Critical",
  },
];

export default function Education() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTerms = glossaryTerms.filter(
    (term) =>
      (selectedCategory === "All" || term.category === selectedCategory) &&
      (term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    "All",
    ...Array.from(new Set(glossaryTerms.map((term) => term.category))),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Cybersecurity Awareness
          </h1>
          <p className="text-gray-600">
            Learn about cyber threats and how to protect yourself
          </p>
        </div>
      </div>

      <Tabs defaultValue="glossary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="glossary" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Glossary
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Safety Tips
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Threat Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="glossary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cybersecurity Glossary</CardTitle>
              <CardDescription>
                Search and explore cybersecurity terms and definitions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4">
                {filteredTerms.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {item.term}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {item.definition}
                          </p>
                        </div>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-6">
            {safetyTips.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Threat Examples</CardTitle>
              <CardDescription>
                Learn to identify common cyber threats with real examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {threatExamples.map((threat, index) => (
                  <Card key={index} className="border-l-4 border-l-red-500">
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {threat.type}
                          </h3>
                          <Badge
                            variant={
                              threat.severity === "Critical"
                                ? "destructive"
                                : threat.severity === "High"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {threat.severity} Risk
                          </Badge>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 italic">
                            "{threat.example}"
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Red Flags to Watch For:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {threat.redFlags.map((flag, flagIndex) => (
                              <div
                                key={flagIndex}
                                className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-md text-sm"
                              >
                                <XCircle className="h-3 w-3" />
                                {flag}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
