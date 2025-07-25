
'use client';

import Link from 'next/link';
import { templates } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { CategorySelectionModal } from '@/components/CategorySelectionModal';

export default function HomePage() {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   const hasSelected = localStorage.getItem('hasSelectedCategory');
  //   if (!hasSelected) {
  //     setIsModalOpen(true);
  //   }
  // }, []);

  // const handleModalClose = () => {
  //   localStorage.setItem('hasSelectedCategory', 'true');
  //   setIsModalOpen(false);
  // };

  return (
    <>
      {/* <CategorySelectionModal open={isModalOpen} onClose={handleModalClose} /> */}
      <div className="space-y-8">
        <section className="text-left py-8">
          <Image 
            src="/doc-illustration.svg"
            alt="Document Icon"
            width={100}
            height={100}
            className="mb-6"
            data-ai-hint="folder icon"
          />
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Welcome to My Biz Docs</h1>
          <p className="text-lg text-foreground/80 max-w-2xl">
            Easily create professional documents from our selection of templates. <br /> Fill in the details, preview, and you're ready to go!
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 ease-in-out">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <template.icon className="h-8 w-8 text-accent" />
                    <CardTitle className="text-xl font-semibold text-primary">{template.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm text-foreground/70 min-h-[40px]">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Optional: Could add a small visual preview or key fields here */}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="default" className="w-full">
                    <Link href={`/templates/${template.id}`}>
                      Create
                    </Link>
                  </Button>
                   <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
