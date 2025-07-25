
'use client';

import type { FormData, DocumentPreviewPropsTemplateInfo } from '@/types';
import { templates } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Printer, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 

interface DocumentPreviewProps {
  templateInfo: DocumentPreviewPropsTemplateInfo;
}

export function DocumentPreview({ templateInfo }: DocumentPreviewProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fullTemplate = templates.find(t => t.id === templateInfo.id);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
        const dataKey = `docuFormPreviewData-${templateInfo.id}`;
        try {
            const storedDataString = sessionStorage.getItem(dataKey);
            if (storedDataString) {
                const parsedData = JSON.parse(storedDataString);
                setFormData(parsedData);
            } else {
                setError('No document data found for preview. Please create the document again.');
            }
        } catch (e) {
            console.error('Failed to load or parse form data from session storage:', e);
            setError('There was an issue loading your document data.');
        } finally {
            setIsLoading(false);
        }
    } else {
        setError('Session storage is not available in this browser.');
        setIsLoading(false);
    }
  }, [templateInfo.id]);

  const handleEdit = () => {
    if (formData && typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(`docuFormEditData-${templateInfo.id}`, JSON.stringify(formData));
        router.push(`/templates/${templateInfo.id}`); 
      } catch (storageError) {
        console.error("Error saving edit data to session storage:", storageError);
        toast({
          variant: "destructive",
          title: "Navigation Error",
          description: "Could not prepare data for editing. Please try again.",
        });
      }
    } else if (!formData) {
         toast({
          variant: "destructive",
          title: "No Data",
          description: "Cannot edit as document data is missing.",
        });
    }
  };

  const handleDownloadPdf = () => {
    toast({
      title: "Print / Save PDF",
      description: "Use your browser's print functionality to save as PDF.",
      variant: "default",
    });
    window.print();
  };
  
  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      .printable-area, .printable-area * {
        visibility: visible;
      }
      .printable-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 20px !important; /* Ensure consistent padding for print */
        box-shadow: none !important;
        border: none !important;
        overflow: visible !important; /* Allow content to expand for print */
      }
      .printable-area .max-w-4xl { /* Override max-width for print if needed */
        max-width: none !important;
      }
      .no-print {
        display: none !important;
      }
      .print-friendly-letterhead {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important; 
        max-width: 100% !important; 
      }
      .print-friendly-letterhead header, .print-friendly-letterhead footer {
         border-color: #ccc !important; 
      }
    }
  `;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-muted-foreground">Loading document preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Preview Error</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button variant="outline" onClick={() => router.push(`/templates/${templateInfo.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Form
        </Button>
      </div>
    );
  }

  if (!fullTemplate) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Preview Error</h1>
        <p className="text-muted-foreground mb-6">Could not load the preview for this document type.</p>
        <Button variant="outline" onClick={() => router.push('/')}>Go to Templates</Button>
      </div>
    );
  }

  if (!formData) {
     return (
       <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">No Data for Preview</h1>
        <p className="text-muted-foreground mb-6">Could not retrieve document data. Please try creating it again.</p>
        <Button variant="outline" onClick={() => router.push(`/templates/${templateInfo.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Form
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <style>{printStyles}</style>
      <Card className="max-w-4xl mx-auto no-print">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div className="flex-grow">
            <CardTitle className="text-2xl font-bold text-primary">Document Preview: {templateInfo.name}</CardTitle>
            <CardDescription className="text-foreground/70">Review your generated document below.</CardDescription>
          </div>
           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="default" onClick={handleEdit} size="sm" className="w-full sm:w-auto">
              <Edit3 className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="default" onClick={handleDownloadPdf} size="sm" className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      <div className="printable-area p-2 sm:p-4 overflow-x-auto">
        {/* The preview component itself may have a max-width, which is fine. The overflow-x-auto handles if its content is wider. */}
        {fullTemplate.previewLayout(formData)}
      </div>

      <div className="max-w-4xl mx-auto mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 no-print">
         <Button variant="default" onClick={handleEdit} className="w-full sm:w-auto">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Document
          </Button>
        <Button variant="default" onClick={handleDownloadPdf} className="w-full sm:w-auto">
          <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>
    </div>
  );
}
