
import React from 'react';
import type { FormData, TemplateField } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as UiTableFooter } from '@/components/ui/table';
import { formatCurrency, formatDate, amountToWords } from '@/lib/formatters';
import Image from 'next/image';

const MAX_INVOICE_ITEMS = 30;

export const InvoicePreview = (data: FormData) => {
  const invoiceItems = [];
  let totalQuantity = 0;
  let totalCostSum = 0;
  let totalClaimValue = 0;

  if (data.includeItemsTable) {
    for (let i = 1; i <= MAX_INVOICE_ITEMS; i++) {
      if (data[`item${i}Description`]) {
        const quantity = parseFloat(data[`item${i}Quantity`] || 1);
        const unitCost = parseFloat(data[`item${i}UnitCost`] || 0);
        const totalCost = quantity * unitCost;
        const claimPercentage = parseFloat(data[`item${i}ClaimPercentage`] || 0);
        const claimValue = (totalCost * claimPercentage) / 100;

        invoiceItems.push({
          sno: invoiceItems.length + 1,
          description: data[`item${i}Description`],
          unit: data[`item${i}Unit`] || 'N/A',
          quantity: quantity,
          unitCost: unitCost,
          totalCost: totalCost,
          claimPercentage: claimPercentage,
          claimValue: claimValue,
        });

        totalQuantity += quantity;
        totalCostSum += totalCost;
        totalClaimValue += claimValue;
      }
    }
  }

  const taxRate = parseFloat(data.taxPercentage || 0);
  const taxAmount = totalClaimValue * (taxRate / 100);
  const grandTotal = totalClaimValue + taxAmount;
  
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg text-sm" data-ai-hint="invoice document">
      <CardHeader className="p-4 sm:p-6 bg-muted/30">
        {data.businessLogo && typeof data.businessLogo === 'string' && data.businessLogo.startsWith('data:image') && (
            <div className="flex justify-center mb-4">
                <Image src={data.businessLogo} alt="Business Logo" width={150} height={75} className="object-contain" data-ai-hint="company brand" />
            </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-grow">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">{data.businessName || 'Your Business Name'}</h1>
            <p className="text-xs sm:text-sm text-foreground/80 whitespace-pre-wrap mt-1">{data.businessAddress || '123 Business St, City, State, PIN'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Contact:</strong> {data.businessContact || 'N/A'} | <strong>Email:</strong> {data.businessEmail || 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>GST No:</strong> {data.businessGstNo || 'N/A'}
            </p>
          </div>
          <div className="text-left sm:text-right text-xs sm:text-sm self-start sm:self-end">
            <p><strong>Invoice No:</strong> {data.invoiceNumber || 'INV-001'}</p>
            <p><strong>Date:</strong> {formatDate(data.invoiceDate)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="border p-3 sm:p-4 rounded-md">
          <h3 className="text-md font-semibold text-primary mb-2">Bill To:</h3>
          <p className="font-bold">{data.clientName || 'Client Name'}</p>
          <p className="whitespace-pre-wrap text-foreground/90">{data.clientAddress || 'Client Address'}</p>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>Contact:</strong> {data.clientContact || 'N/A'} | <strong>Email:</strong> {data.clientEmail || 'N/A'}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>GST No:</strong> {data.clientGstNo || 'N/A'}
          </p>
        </div>

        {data.includeItemsTable && invoiceItems.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="p-2 w-10">Sl. No.</TableHead>
                  <TableHead className="p-2">Description</TableHead>
                  <TableHead className="p-2 w-20">Unit</TableHead>
                  <TableHead className="p-2 text-right w-20">Quantity</TableHead>
                  <TableHead className="p-2 text-right w-24">Unit Cost</TableHead>
                  <TableHead className="p-2 text-right w-24">Total Cost</TableHead>
                  <TableHead className="p-2 text-right w-20">Claim (%)</TableHead>
                  <TableHead className="p-2 text-right w-24">Claim Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item) => (
                  <TableRow key={item.sno}>
                    <TableCell className="p-2 text-center">{item.sno}</TableCell>
                    <TableCell className="p-2 whitespace-pre-wrap">{item.description}</TableCell>
                    <TableCell className="p-2">{item.unit}</TableCell>
                    <TableCell className="p-2 text-right">{item.quantity.toFixed(2)}</TableCell>
                    <TableCell className="p-2 text-right">{formatCurrency(item.unitCost)}</TableCell>
                    <TableCell className="p-2 text-right font-medium">{formatCurrency(item.totalCost)}</TableCell>
                    <TableCell className="p-2 text-right">{item.claimPercentage > 0 ? `${item.claimPercentage}%` : '-'}</TableCell>
                    <TableCell className="p-2 text-right font-medium">{formatCurrency(item.claimValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <UiTableFooter>
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={3} className="p-2 text-right text-primary">TOTAL</TableCell>
                  <TableCell className="p-2 text-right text-primary">{totalQuantity.toFixed(2)}</TableCell>
                  <TableCell className="p-2 text-right text-primary"></TableCell>
                  <TableCell className="p-2 text-right text-primary">{formatCurrency(totalCostSum)}</TableCell>
                  <TableCell className="p-2 text-right text-primary"></TableCell>
                  <TableCell className="p-2 text-right text-primary">{formatCurrency(totalClaimValue)}</TableCell>
                </TableRow>
              </UiTableFooter>
            </Table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-grow text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Amount in Words:</p>
            <p className="italic">{amountToWords(grandTotal)}</p>
          </div>
          <div className="w-full sm:w-2/5 md:w-1/3 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Total Claim Value:</span>
              <span>{formatCurrency(totalClaimValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tax ({taxRate}%):</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <Separator className="my-1"/>
            <div className="flex justify-between font-bold text-lg text-primary">
              <span>Total Amount:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t mt-6">
          {/* Left Column: Bank Details */}
          <div className="text-xs space-y-1">
            <h3 className="text-md font-semibold text-primary mb-2">Bank Details:</h3>
            <p><strong>Bank Name:</strong> {data.bankName || 'N/A'}</p>
            <p><strong>Branch:</strong> {data.branchName || 'N/A'}</p>
            <p><strong>Account No:</strong> {data.accountNo || 'N/A'}</p>
            <p><strong>IFSC Code:</strong> {data.ifscCode || 'N/A'}</p>
          </div>
          
          {/* Right Column: Signature */}
          <div className="text-center flex flex-col justify-end">
            <div className="border-b border-foreground/50 min-h-[60px] flex items-center justify-center">
              {data.authorisedSignature && typeof data.authorisedSignature === 'string' && data.authorisedSignature.startsWith('data:image') ? (
                  <Image src={data.authorisedSignature} alt="Authorised Signature" width={150} height={50} className="object-contain" data-ai-hint="signature drawing" />
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Authorised Signatory for {data.businessName || 'Your Business Name'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const invoiceFields: TemplateField[] = [
  // Business Details
  { id: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Your Company Name' },
  { id: 'businessAddress', label: 'Business Address', type: 'textarea', placeholder: '123 Business St, City, State, PIN' },
  { id: 'businessContact', label: 'Business Contact', type: 'text', placeholder: '9876543210' },
  { id: 'businessEmail', label: 'Business Email', type: 'email', placeholder: 'contact@business.com' },
  { id: 'businessGstNo', label: 'Business GST No.', type: 'text', placeholder: '22AAAAA0000A1Z5' },
  { id: 'businessLogo', label: 'Business Logo (optional)', type: 'file' },

  // Client Details
  { id: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Mr. John Doe' },
  { id: 'clientAddress', label: 'Client Address', type: 'textarea', placeholder: '456 Client St, City, State, PIN' },
  { id: 'clientContact', label: 'Client Contact', type: 'text', placeholder: '9998887770' },
  { id: 'clientEmail', label: 'Client Email', type: 'email', placeholder: 'client@example.com' },
  { id: 'clientGstNo', label: 'Client GST No. (optional)', type: 'text', placeholder: '22BBBBB0000B1Z5' },

  // Invoice Info
  { id: 'invoiceNumber', label: 'Invoice Number', type: 'text' },
  { id: 'invoiceDate', label: 'Invoice Date', type: 'date' },

  // Invoice Items
  { id: 'includeItemsTable', label: 'Invoice Items', type: 'boolean', defaultValue: true },
  ...Array.from({ length: MAX_INVOICE_ITEMS }, (_, i) => i + 1).flatMap(idx => ([
    { id: `item${idx}Description`, label: `Item #${idx} Description`, type: 'text' },
    { id: `item${idx}Unit`, label: 'Unit', type: 'select', options: [ { value: 'pcs', label: 'Piece' }, { value: 'sq.ft.', label: 'Sq. Ft.' }, { value: 'kg', label: 'Kg' }, { value: 'lit.', label: 'Litre' }, { value: 'lumpsum', label: 'Lumpsum' } ], defaultValue: 'pcs', placeholder: 'Select unit' },
    { id: `item${idx}Quantity`, label: 'Quantity', type: 'number' },
    { id: `item${idx}UnitCost`, label: 'Unit Cost (INR)', type: 'number' },
    { id: `item${idx}ClaimPercentage`, label: 'Claim Amount (%)', type: 'number' },
  ] as TemplateField[])),

  // Calculation
  { id: 'taxPercentage', label: 'Tax Percentage (%)', type: 'number' },

  // Bank Details
  { id: 'bankName', label: 'Bank Name', type: 'text', placeholder: 'Your Bank Name' },
  { id: 'branchName', label: 'Branch Name', type: 'text', placeholder: 'Your Branch Name' },
  { id: 'accountNo', label: 'Account Number', type: 'text', placeholder: 'Your Bank Account Number' },
  { id: 'ifscCode', label: 'IFSC Code', type: 'text', placeholder: 'YOURBANK000123' },
  
  // Signature
  { id: 'authorisedSignature', label: 'Authorised Signature Image (optional)', type: 'file' },
];
