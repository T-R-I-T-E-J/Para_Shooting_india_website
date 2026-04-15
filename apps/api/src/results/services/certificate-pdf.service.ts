<<<<<<< Updated upstream
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode';

// Data Interfaces
export interface EventResultRaw {
  srNo: number;
  name: string;
  mqs: string;
  score: string;
  position: string;
  isNumeric: boolean;
}

export interface ShooterData {
  certNo: string;
  competitorNo: string;
  athleteName: string;
  state: string;
  competitionName: string;
  venue: string;
  startDate: string;
  endDate: string;
  month: string;
  year: string;
  events: EventResultRaw[];
}

export class CertificatePdfService {
  private templateCache: handlebars.TemplateDelegate | null = null;

  constructor() {
    this.registerHandlebarsHelpers();
=======
import * as fs from 'fs'
import * as path from 'path'
import * as handlebars from 'handlebars'
import * as puppeteer from 'puppeteer'
import * as qrcode from 'qrcode'

// Data Interfaces
export interface EventResultRaw {
  srNo: number
  name: string
  mqs: string
  score: string
  position: string
  isNumeric: boolean
}

export interface ShooterData {
  certNo: string
  competitorNo: string
  athleteName: string
  state: string
  competitionName: string
  venue: string
  startDate: string
  endDate: string
  month: string
  year: string
  events: EventResultRaw[]
}

export class CertificatePdfService {
  private templateCache: handlebars.TemplateDelegate | null = null

  constructor() {
    this.registerHandlebarsHelpers()
>>>>>>> Stashed changes
  }

  /**
   * Registers custom Handlebars helpers for logic formatting in the template.
   */
  private registerHandlebarsHelpers() {
    // Already defined in pre-processing, but good to have helper capabilities
    handlebars.registerHelper('uppercase', (str) => {
<<<<<<< Updated upstream
      return typeof str === 'string' ? str.toUpperCase() : str;
    });
=======
      return typeof str === 'string' ? str.toUpperCase() : str
    })
>>>>>>> Stashed changes
  }

  /**
   * Compiles and formats the athlete data, adding boolean flags for medals.
   */
  private prepareData(data: ShooterData) {
<<<<<<< Updated upstream
    let hasDecimalScore = false;
=======
    let hasDecimalScore = false
>>>>>>> Stashed changes

    const formattedEvents = data.events.map((event) => {
      // Check for decimal scoring rule
      if (event.score && event.score.includes('.')) {
<<<<<<< Updated upstream
        hasDecimalScore = true;
      }

      // Format positions (e.g. 1 -> GOLD, 2 -> SILVER, 7 -> 7TH, DNF -> DNF)
      let formattedPos = String(event.position).trim().toUpperCase();
      let isGold = false;
      let isSilver = false;
      let isBronze = false;

      if (formattedPos === '1' || formattedPos === 'GOLD') {
        formattedPos = 'GOLD';
        isGold = true;
      } else if (formattedPos === '2' || formattedPos === 'SILVER') {
        formattedPos = 'SILVER';
        isSilver = true;
      } else if (formattedPos === '3' || formattedPos === 'BRONZE') {
        formattedPos = 'BRONZE';
        isBronze = true;
      } else if (!isNaN(Number(formattedPos))) {
        // e.g. "4th", "7th"
        formattedPos = `${formattedPos}TH`;
=======
        hasDecimalScore = true
      }

      // Format positions (e.g. 1 -> GOLD, 2 -> SILVER, 7 -> 7TH, DNF -> DNF)
      let formattedPos = String(event.position).trim().toUpperCase()
      let isGold = false
      let isSilver = false
      let isBronze = false

      if (formattedPos === '1' || formattedPos === 'GOLD') {
        formattedPos = 'GOLD'
        isGold = true
      } else if (formattedPos === '2' || formattedPos === 'SILVER') {
        formattedPos = 'SILVER'
        isSilver = true
      } else if (formattedPos === '3' || formattedPos === 'BRONZE') {
        formattedPos = 'BRONZE'
        isBronze = true
      } else if (!isNaN(Number(formattedPos))) {
        // e.g. "4th", "7th"
        formattedPos = \`\${formattedPos}TH\`
>>>>>>> Stashed changes
      }

      return {
        ...event,
        position: formattedPos,
        isGold,
        isSilver,
        isBronze,
<<<<<<< Updated upstream
      };
    });
=======
      }
    })
>>>>>>> Stashed changes

    return {
      ...data,
      events: formattedEvents,
      hasDecimalScore,
      generatedDate: new Date().toLocaleDateString('en-IN'), // Display generated timestamp
<<<<<<< Updated upstream
    };
=======
    }
>>>>>>> Stashed changes
  }

  /**
   * Generates a base64 QR code image to embed directly in the HTML.
   */
  private async generateQRCode(dataStr: string): Promise<string> {
    try {
<<<<<<< Updated upstream
      return await qrcode.toDataURL(dataStr, { margin: 1 });
    } catch (err) {
      console.error('Failed to generate QR:', err);
      return '';
=======
      return await qrcode.toDataURL(dataStr, { margin: 1 })
    } catch (err) {
      console.error('Failed to generate QR:', err)
      return ''
>>>>>>> Stashed changes
    }
  }

  /**
   * Loads the HBS template from disk and compiles it.
   */
  private getCompiledTemplate(): handlebars.TemplateDelegate {
    if (this.templateCache) {
<<<<<<< Updated upstream
      return this.templateCache;
    }

    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      'certificate.hbs',
    );
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    this.templateCache = handlebars.compile(templateHtml);

    return this.templateCache;
=======
      return this.templateCache
    }

    const templatePath = path.join(__dirname, '..', 'templates', 'certificate.hbs')
    const templateHtml = fs.readFileSync(templatePath, 'utf8')
    this.templateCache = handlebars.compile(templateHtml)
    
    return this.templateCache
>>>>>>> Stashed changes
  }

  /**
   * Main function: Renders the Handlebars template and launches Puppeteer to generate the PDF Buffer.
   */
<<<<<<< Updated upstream
  public async generateCertificatePdf(
    shooterData: ShooterData,
  ): Promise<Buffer> {
    try {
      // 1. Prepare data (Add isGold flags, format positions, generate QR Code)
      const preparedData = this.prepareData(shooterData);
      const qrCodeDataUrl = await this.generateQRCode(
        `verify.psai.in/cert/${shooterData.certNo}`,
      );

      // 2. Fetch compiled template and render HTML string
      const template = this.getCompiledTemplate();
=======
  public async generateCertificatePdf(shooterData: ShooterData): Promise<Buffer> {
    try {
      // 1. Prepare data (Add isGold flags, format positions, generate QR Code)
      const preparedData = this.prepareData(shooterData)
      const qrCodeDataUrl = await this.generateQRCode(\`verify.psai.in/cert/\${shooterData.certNo}\`)

      // 2. Fetch compiled template and render HTML string
      const template = this.getCompiledTemplate()
>>>>>>> Stashed changes
      const htmlContent = template({
        ...preparedData,
        qrCodeDataUrl,
        // Paths to logos (In production, replace these with actual remote URLs or base64 embedded imgs)
        // pciLogoUrl: 'https://...',
        // psaiLogoUrl: 'https://...'
<<<<<<< Updated upstream
      });
=======
      })
>>>>>>> Stashed changes

      // 3. Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true, // "new" headless mode
<<<<<<< Updated upstream
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      // 4. Set Content & wait for fonts/assets to load
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });
=======
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })

      const page = await browser.newPage()

      // 4. Set Content & wait for fonts/assets to load
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      })
>>>>>>> Stashed changes

      // Optional: Inject Google Fonts if Arial/Georgia fallback is not enough
      /*
      await page.addStyleTag({
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
      });
      */

      // 5. Render A4 PDF Buffer
      // We printBackground so our glassmorphism borders and custom colours render
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true, // Respect @page directives defined in the HTML
<<<<<<< Updated upstream
        margin: { top: '0', right: '0', bottom: '0', left: '0' }, // Ensure zero margins around A4 page
      });

      await browser.close();

      // 6. Return standard Node Buffer (can be piped to res.send in NestJS controller)
      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
=======
        margin: { top: '0', right: '0', bottom: '0', left: '0' } // Ensure zero margins around A4 page
      })

      await browser.close()

      // 6. Return standard Node Buffer (can be piped to res.send in NestJS controller)
      return Buffer.from(pdfBuffer)

    } catch (error) {
       console.error('Error generating PDF:', error)
       throw error
>>>>>>> Stashed changes
    }
  }
}
