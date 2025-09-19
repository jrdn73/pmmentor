import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Roadmap } from '@/app/page';

export async function POST(request: NextRequest) {
  try {
    console.log('PDF generation request received');
    
    const roadmap: Roadmap = await request.json();
    console.log('Roadmap data parsed:', { 
      id: roadmap?.id, 
      goal: roadmap?.goal, 
      milestonesCount: roadmap?.milestones?.length 
    });

    if (!roadmap) {
      console.error('No roadmap data provided');
      return NextResponse.json(
        { error: 'Roadmap data is required' },
        { status: 400 }
      );
    }

    if (!roadmap.goal || !roadmap.milestones || !Array.isArray(roadmap.milestones)) {
      console.error('Invalid roadmap structure:', roadmap);
      return NextResponse.json(
        { error: 'Invalid roadmap structure' },
        { status: 400 }
      );
    }

    // Create a new PDF document
    console.log('Creating PDF document...');
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    console.log('PDF page created:', { width, height });

    // Load fonts
    console.log('Loading fonts...');
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    console.log('Fonts loaded successfully');

    let yPosition = height - 50;
    const margin = 50;
    const lineHeight = 20;
    const sectionSpacing = 30;

    // Helper function to add text with word wrapping
    const addText = (text: string, x: number, y: number, fontSize: number, fontType: typeof font, color = rgb(0, 0, 0)) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const textWidth = fontType.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth > width - 2 * margin && i > 0) {
          page.drawText(line, { x, y: currentY, size: fontSize, font: fontType, color });
          line = words[i] + ' ';
          currentY -= lineHeight;
        } else {
          line = testLine;
        }
      }
      page.drawText(line, { x, y: currentY, size: fontSize, font: fontType, color });
      return currentY - lineHeight;
    };

    // Title
    yPosition = addText('Career Roadmap Generator', margin, yPosition, 24, boldFont, rgb(0.4, 0.2, 0.8));
    yPosition -= 10;

    // Goal
    yPosition = addText('Career Goal:', margin, yPosition, 16, boldFont);
    yPosition = addText(roadmap.goal, margin, yPosition, 14, font);
    yPosition -= sectionSpacing;

    // Background
    if (roadmap.background) {
      yPosition = addText('Background:', margin, yPosition, 16, boldFont);
      yPosition = addText(roadmap.background, margin, yPosition, 14, font);
      yPosition -= sectionSpacing;
    }

    // Timeline
    if (roadmap.timeline) {
      yPosition = addText('Timeline:', margin, yPosition, 16, boldFont);
      yPosition = addText(roadmap.timeline, margin, yPosition, 14, font);
      yPosition -= sectionSpacing;
    }

    // Weaknesses
    if (roadmap.weaknesses && roadmap.weaknesses.length > 0) {
      yPosition = addText('Areas to Improve:', margin, yPosition, 16, boldFont);
      yPosition = addText(roadmap.weaknesses.join(', '), margin, yPosition, 14, font);
      yPosition -= sectionSpacing;
    }

    // Milestones
    yPosition = addText('Milestones:', margin, yPosition, 18, boldFont, rgb(0.4, 0.2, 0.8));
    yPosition -= 10;

    roadmap.milestones.forEach((milestone, index) => {
      // Check if we need a new page
      if (yPosition < 100) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        page = newPage;
        yPosition = height - 50;
      }

      // Milestone title
      yPosition = addText(`${index + 1}. ${milestone.title}`, margin, yPosition, 16, boldFont);
      
      // Description
      yPosition = addText(milestone.description, margin + 20, yPosition, 12, font);
      yPosition -= 5;

      // Duration
      yPosition = addText(`Duration: ${milestone.estimated_duration}`, margin + 20, yPosition, 10, font, rgb(0.5, 0.5, 0.5));
      yPosition -= 10;

      // Tasks
      yPosition = addText('Tasks:', margin + 20, yPosition, 12, boldFont);
      milestone.tasks.forEach((task) => {
        yPosition = addText(`• ${task}`, margin + 40, yPosition, 10, font);
      });
      yPosition -= 10;

      // Resources
      if (milestone.resource_links.length > 0) {
        yPosition = addText('Resources:', margin + 20, yPosition, 12, boldFont);
        milestone.resource_links.forEach((resource) => {
          yPosition = addText(`• ${resource.title}`, margin + 40, yPosition, 10, font);
          yPosition = addText(`  URL: ${resource.url}`, margin + 40, yPosition, 9, font, rgb(0.2, 0.4, 0.8));
        });
      }

      yPosition -= sectionSpacing;
    });

    // Footer
    const footerY = 50;
    addText(`Generated on ${new Date(roadmap.generated_at).toLocaleDateString()}`, margin, footerY, 10, font, rgb(0.5, 0.5, 0.5));
    addText(`Roadmap ID: ${roadmap.id}`, width - margin - 100, footerY, 10, font, rgb(0.5, 0.5, 0.5));

    // Generate PDF bytes
    console.log('Generating PDF bytes...');
    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully, size:', pdfBytes.length, 'bytes');

    // Return PDF as response
    console.log('Returning PDF response');
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="career-roadmap-${roadmap.id}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
