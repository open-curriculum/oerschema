import React from 'react';

interface ExampleCardProps {
  title: string;
  description?: string;
  implementation: string;
  visual: React.ReactNode;
}

export function ExampleCard({ title, description, implementation, visual }: ExampleCardProps) {
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
          
          {/* Implementation code */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Implementation</h3>
            <div className="bg-muted rounded-lg overflow-hidden">
              <div className="p-4 overflow-auto max-h-[400px]">
                <pre className="text-sm whitespace-pre-wrap break-all md:break-normal">{implementation}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}