import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";

interface ExampleCardProps {
  title: string;
  description?: string;
  htmlImplementation: string;
  vitepressImplementation: string;
  visual: React.ReactNode;
}

export function ExampleCard({ title, description, htmlImplementation, vitepressImplementation, visual }: ExampleCardProps) {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedVitepress, setCopiedVitepress] = useState(false);

  const copyToClipboard = async (text: string, type: 'html' | 'vitepress') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'html') {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      } else {
        setCopiedVitepress(true);
        setTimeout(() => setCopiedVitepress(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-card border shadow-md rounded-lg">
        <div className="border-b bg-muted/50 px-4 md:px-6 pt-4 pb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && <p className="mt-2 text-muted-foreground">{description}</p>}
        </div>
        
        <div className="flex flex-col gap-6 p-4 md:p-6">
          {/* Visual preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preview</h3>
            <div className="bg-background border rounded-lg p-5">
              {visual}
            </div>
          </div>
          
          {/* Implementation code with tabs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Implementation</h3>
            <Tabs defaultValue="html" className="w-full">
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="vitepress">VitePress</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="mt-4">
                <div className="bg-muted rounded-lg overflow-hidden relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(htmlImplementation, 'html')}
                      className="bg-background"
                    >
                      {copiedHtml ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="p-4 overflow-auto max-h-[400px]">
                    <pre className="text-sm whitespace-pre-wrap break-all md:break-normal">{htmlImplementation}</pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vitepress" className="mt-4">
                <div className="bg-muted rounded-lg overflow-hidden relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(vitepressImplementation, 'vitepress')}
                      className="bg-background"
                    >
                      {copiedVitepress ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="p-4 overflow-auto max-h-[400px]">
                    <pre className="text-sm whitespace-pre-wrap break-all md:break-normal">{vitepressImplementation}</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}