import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import JSZip from 'jszip';
import { HttpClient } from '@angular/common/http';

// --- Interfaces ---
interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  convertedBlob?: Blob;
  convertedPreview?: string;
  compressedSize?: number;
  error?: string;
}

interface DropdownOption {
  name: string;
  value: string;
}

interface PageData {
  hero: { title: string; subtitle: string; description: string; features: string[] };
  settings: { title: string; description: string; outputFormatLabel: string; compressionModeLabel: string; qualityLevelLabel: string; targetFileSizeLabel: string };
  upload: { title: string; subtitle: string; buttonText: string; supportedFormats: string };
  fileList: { title: string; readyText: string; clearAll: string; download: string; remove: string };
  actions: { convertButton: string; convertingText: string; downloadAll: string };
  stats: { successMessage: string };
  features: Array<{ title: string; description: string; icon: string }>;
  howTo: { title: string; steps: Array<{ number: number; title: string; description: string }> };
  whatIsJfif: { title: string; content: string[] };
  whyConvert: { title: string; items: Array<{ title: string; description: string; icon: string }> };
  supportedFormats: { title: string; formats: Array<{ name: string; description: string; color: string }> };
  faq: { title: string; questions: Array<{ question: string; answer: string; icon: string }> };
  benefits: { title: string; items: Array<{ emoji: string; title: string; description: string }> };
  useCases: { title: string; cases: Array<{ emoji: string; title: string; description: string }> };
  footerCta: { title: string; description: string; buttonText: string };
}

// Supported output formats
type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'bmp' | 'ico' | 'tiff' | 'gif';

@Component({
  selector: 'app-image-converter',
  imports: [CommonModule, FormsModule],
  templateUrl: './image-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  `]
})
export class ImageConverterComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly http = inject(HttpClient);

  // --- Signals ---
  readonly files = signal<ImageFile[]>([]);
  readonly dragActive = signal(false);
  readonly converting = signal(false);
  readonly pageData = signal<PageData | null>(null);

  readonly convertedFiles = computed(() => this.files().filter(f => f.status === 'completed'));
  readonly allConverted = computed(() =>
    this.files().length > 0 && this.files().every(f => f.status === 'completed' || f.status === 'error')
  );

  // Settings
  outputFormat: OutputFormat = 'jpeg';
  compressionMode = 'quality';
  quality = '0.9';
  targetFileSize = '200';

  // --- Output format options (all workable) ---
  readonly imageType: DropdownOption[] = [
    { name: 'JPEG  (.jpg)  — Best for photos', value: 'jpeg' },
    { name: 'PNG   (.png)  — Lossless + transparency', value: 'png' },
    { name: 'WebP  (.webp) — Modern, small size', value: 'webp' },
    { name: 'AVIF  (.avif) — Next-gen compression', value: 'avif' },
    { name: 'BMP   (.bmp)  — Uncompressed bitmap', value: 'bmp' },
    { name: 'ICO   (.ico)  — Windows icon format', value: 'ico' },
    { name: 'TIFF  (.tiff) — High-quality print', value: 'tiff' },
    { name: 'GIF   (.gif)  — Legacy + animations', value: 'gif' },
  ];

  readonly compressionModeList: DropdownOption[] = [
    { name: 'By Quality', value: 'quality' },
    { name: 'Target File Size', value: 'filesize' }
  ];

  readonly qualityList: DropdownOption[] = [
    { name: 'Maximum (100%)', value: '1.0' },
    { name: 'Very High (90%)', value: '0.9' },
    { name: 'High (80%)', value: '0.8' },
    { name: 'Medium (60%)', value: '0.6' },
    { name: 'Low (40%)', value: '0.4' }
  ];

  readonly targetSizeList: DropdownOption[] = [
    { name: '50 KB', value: '50' },
    { name: '100 KB', value: '100' },
    { name: '200 KB', value: '200' },
    { name: '500 KB', value: '500' },
    { name: '1 MB', value: '1024' },
    { name: '2 MB', value: '2048' }
  ];

  ngOnInit() {
    this.titleService.setTitle('Free Image Converter Pro - Convert & Compress Locally');
    this.metaService.addTags([
      { name: 'description', content: 'Convert JPG, PNG, WebP, AVIF, BMP, ICO, TIFF, GIF images locally in your browser. Free, secure, fast.' },
      { name: 'keywords', content: 'image converter, jpg to png, webp to jpg, avif converter, ico converter, bmp converter' }
    ]);
    this.http.get<PageData>('/assets/data/image-converter-data.json').subscribe({
      next: (data) => this.pageData.set(data),
      error: (error) => console.error('Error loading page data:', error)
    });
  }

  // --- Drag & Drop ---

  handleDrag(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      this.dragActive.set(true);
    } else {
      this.dragActive.set(false);
    }
  }

  handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dragActive.set(false);
    if (e.dataTransfer?.files) this.processFiles(e.dataTransfer.files);
  }

  handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) this.processFiles(input.files);
    input.value = '';
  }

  processFiles(fileList: FileList) {
    Array.from(fileList).forEach(file => {
      if (!file.type.match('image.*')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.files.update(current => [...current, {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          status: 'pending'
        }]);
      };
      reader.readAsDataURL(file);
    });
  }

  onCompressionModeChange() { }

  // --- Conversion Orchestrator ---

  async convertImages() {
    this.converting.set(true);
    for (const imageFile of this.files()) {
      if (imageFile.status === 'completed') continue;
      this.updateFileStatus(imageFile.id, 'converting');
      try {
        let convertedBlob: Blob;
        if (this.compressionMode === 'filesize') {
          convertedBlob = await this.convertByFileSize(imageFile.file);
        } else {
          convertedBlob = await this.convertFile(imageFile.file, parseFloat(this.quality));
        }
        this.files.update(current =>
          current.map(f => f.id === imageFile.id
            ? { ...f, convertedBlob, compressedSize: convertedBlob.size, status: 'completed' }
            : f
          )
        );
      } catch (error) {
        this.updateFileStatus(imageFile.id, 'error');
        console.error(`Error converting ${imageFile.file.name}:`, error);
      }
    }
    this.converting.set(false);
  }

  private updateFileStatus(id: string, status: ImageFile['status']) {
    this.files.update(current => current.map(f => f.id === id ? { ...f, status } : f));
  }

  // --- Core Conversion: Routes to format-specific methods ---

  private async convertFile(file: File, quality: number): Promise<Blob> {
    const canvas = await this.fileToCanvas(file);
    return this.canvasToBlob(canvas, this.outputFormat, quality);
  }

  private async canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number): Promise<Blob> {
    switch (format) {
      case 'bmp':  return this.canvasToBmp(canvas);
      case 'ico':  return this.canvasToIco(canvas);
      case 'tiff': return this.canvasToTiff(canvas);
      case 'gif':  return this.canvasToGif(canvas);
      default:     return this.canvasToNativeBlob(canvas, format, quality);
    }
  }

  // --- File → Canvas helper ---

  private fileToCanvas(file: File): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target?.result as string; };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context failed')); return; }
        // Fill white background (needed for JPEG, ICO, etc.)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      reader.readAsDataURL(file);
    });
  }

  // --- Native canvas.toBlob (JPEG, PNG, WebP, AVIF) ---

  private canvasToNativeBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number): Promise<Blob> {
    const mimeType = this.getMimeType(format);
    return new Promise((resolve, reject) => {
      // Check AVIF support first
      if (format === 'avif') {
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 1; testCanvas.height = 1;
        const testCtx = testCanvas.getContext('2d');
        if (testCtx) {
          testCanvas.toBlob(testBlob => {
            if (!testBlob) {
              // AVIF not supported, fallback to WebP
              canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('WebP fallback failed')), 'image/webp', quality);
            } else {
              canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('AVIF conversion failed')), mimeType, quality);
            }
          }, 'image/avif');
          return;
        }
      }
      canvas.toBlob(blob => {
        blob ? resolve(blob) : reject(new Error(`${format} conversion failed`));
      }, mimeType, quality);
    });
  }

  // --- BMP writer (24-bit, bottom-up) ---

  private canvasToBmp(canvas: HTMLCanvasElement): Blob {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;

    const rowSize = Math.ceil((24 * width) / 32) * 4; // padded row
    const pixelDataSize = rowSize * height;
    const fileSize = 54 + pixelDataSize;
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);

    // BMP File Header (14 bytes)
    view.setUint8(0, 0x42); view.setUint8(1, 0x4D); // 'BM'
    view.setUint32(2, fileSize, true);
    view.setUint32(6, 0, true);          // reserved
    view.setUint32(10, 54, true);        // pixel data offset

    // BITMAPINFOHEADER (40 bytes)
    view.setUint32(14, 40, true);        // header size
    view.setInt32(18, width, true);
    view.setInt32(22, height, true);     // positive = bottom-up
    view.setUint16(26, 1, true);         // color planes
    view.setUint16(28, 24, true);        // bits per pixel (24-bit RGB)
    view.setUint32(30, 0, true);         // no compression (BI_RGB)
    view.setUint32(34, pixelDataSize, true);
    view.setInt32(38, 2835, true);       // 72 DPI horizontal
    view.setInt32(42, 2835, true);       // 72 DPI vertical
    view.setUint32(46, 0, true);
    view.setUint32(50, 0, true);

    // Pixel data (BGR, bottom-up rows)
    let offset = 54;
    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        view.setUint8(offset++, data[i + 2]); // B
        view.setUint8(offset++, data[i + 1]); // G
        view.setUint8(offset++, data[i]);     // R
      }
      // Row padding
      for (let p = 0; p < rowSize - width * 3; p++) {
        view.setUint8(offset++, 0);
      }
    }

    return new Blob([buffer], { type: 'image/bmp' });
  }

  // --- ICO writer (PNG-wrapped, supports up to 256×256) ---

  private async canvasToIco(canvas: HTMLCanvasElement): Promise<Blob> {
    // Resize to common ICO sizes (use 32x32 for single-size ICO, or 256x256 for best quality)
    const icoSize = Math.min(Math.max(canvas.width, canvas.height), 256);
    const resized = document.createElement('canvas');
    resized.width = icoSize;
    resized.height = icoSize;
    const ctx = resized.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, icoSize, icoSize);
    ctx.drawImage(canvas, 0, 0, icoSize, icoSize);

    // Get PNG bytes of the resized image
    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      resized.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG export failed')), 'image/png');
    });
    const pngData = new Uint8Array(await pngBlob.arrayBuffer());

    // ICO Container: 6-byte header + 16-byte directory entry + PNG bytes
    const headerSize = 6 + 16;
    const buffer = new ArrayBuffer(headerSize + pngData.length);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // ICONDIR header
    view.setUint16(0, 0, true);      // reserved
    view.setUint16(2, 1, true);      // type: 1 = ICO
    view.setUint16(4, 1, true);      // count: 1 image

    // ICONDIRENTRY
    view.setUint8(6, icoSize >= 256 ? 0 : icoSize); // width (0 = 256)
    view.setUint8(7, icoSize >= 256 ? 0 : icoSize); // height
    view.setUint8(8, 0);             // color count (0 = true color)
    view.setUint8(9, 0);             // reserved
    view.setUint16(10, 1, true);     // color planes
    view.setUint16(12, 32, true);    // bits per pixel
    view.setUint32(14, pngData.length, true); // image data size
    view.setUint32(18, headerSize, true);     // offset of image data

    bytes.set(pngData, headerSize);

    return new Blob([buffer], { type: 'image/x-icon' });
  }

  // --- TIFF writer (uncompressed, 24-bit RGB, baseline Tag Image File Format) ---

  private canvasToTiff(canvas: HTMLCanvasElement): Blob {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;

    // Build RGB strip (3 bytes per pixel, no alpha)
    const stripSize = width * height * 3;
    const totalSize = 8 + stripSize + 200; // generous header allocation
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // Write pixel data first (after IFD)
    const stripOffset = 8 + 174; // 8-byte header + IFD entries
    for (let i = 0; i < width * height; i++) {
      const src = i * 4;
      const dst = stripOffset + i * 3;
      bytes[dst]     = data[src];     // R
      bytes[dst + 1] = data[src + 1]; // G
      bytes[dst + 2] = data[src + 2]; // B
    }

    // TIFF 8-byte header
    view.setUint8(0, 0x49); view.setUint8(1, 0x49); // Little-endian 'II'
    view.setUint16(2, 42, true);    // TIFF magic number
    view.setUint32(4, 8, true);     // Offset to first IFD

    // IFD: 11 tags (2 bytes count + 11×12 bytes tags + 4 bytes next IFD offset)
    let pos = 8;
    view.setUint16(pos, 11, true); pos += 2; // tag count

    const writeTag = (tag: number, type: number, count: number, value: number) => {
      view.setUint16(pos, tag, true);
      view.setUint16(pos + 2, type, true);
      view.setUint32(pos + 4, count, true);
      view.setUint32(pos + 8, value, true);
      pos += 12;
    };

    // Rational values written after IFD
    const rationalOffset = 8 + 2 + 11 * 12 + 4;
    view.setUint32(rationalOffset, 72, true);  // numerator (72 DPI)
    view.setUint32(rationalOffset + 4, 1, true); // denominator

    writeTag(0x0100, 3, 1, width);                  // ImageWidth  (SHORT)
    writeTag(0x0101, 3, 1, height);                 // ImageLength (SHORT)
    writeTag(0x0102, 3, 1, 8);                      // BitsPerSample = 8
    writeTag(0x0103, 3, 1, 1);                      // Compression = none
    writeTag(0x0106, 3, 1, 2);                      // PhotometricInterpretation = RGB
    writeTag(0x0111, 4, 1, stripOffset);            // StripOffsets
    writeTag(0x0115, 3, 1, 3);                      // SamplesPerPixel = 3
    writeTag(0x0116, 3, 1, height);                 // RowsPerStrip = height (single strip)
    writeTag(0x0117, 4, 1, stripSize);              // StripByteCounts
    writeTag(0x011A, 5, 1, rationalOffset);         // XResolution = 72 DPI (RATIONAL)
    writeTag(0x011B, 5, 1, rationalOffset);         // YResolution = 72 DPI (RATIONAL)

    view.setUint32(pos, 0, true); // Next IFD offset = 0 (no more IFDs)

    return new Blob([buffer.slice(0, stripOffset + stripSize)], { type: 'image/tiff' });
  }

  // --- GIF writer (single-frame, 256-color palette via median-cut quantization) ---

  private canvasToGif(canvas: HTMLCanvasElement): Blob {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;

    // Build a basic 256-color palette by sampling N evenly spaced pixels
    const palette: number[][] = [];
    const step = Math.max(1, Math.floor((width * height) / 256));
    for (let i = 0; i < width * height && palette.length < 256; i += step) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      // Deduplicate roughly
      const exists = palette.some(c => Math.abs(c[0] - r) < 16 && Math.abs(c[1] - g) < 16 && Math.abs(c[2] - b) < 16);
      if (!exists) palette.push([r, g, b]);
    }
    while (palette.length < 256) palette.push([0, 0, 0]);

    const findClosestColor = (r: number, g: number, b: number): number => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < palette.length; i++) {
        const dr = palette[i][0] - r;
        const dg = palette[i][1] - g;
        const db = palette[i][2] - b;
        const dist = dr * dr + dg * dg + db * db;
        if (dist < bestDist) { bestDist = dist; best = i; }
      }
      return best;
    };

    // Map each pixel to palette index
    const indices = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      indices[i] = findClosestColor(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    }

    // Build GIF byte stream manually
    const gifBytes: number[] = [];
    const write = (...bytes: number[]) => gifBytes.push(...bytes);
    const writeU16 = (v: number) => { write(v & 0xFF, (v >> 8) & 0xFF); };
    const writeStr = (s: string) => { for (let i = 0; i < s.length; i++) write(s.charCodeAt(i)); };

    // Header
    writeStr('GIF89a');
    writeU16(width); writeU16(height);
    write(0xF7, 0, 0); // GCT flag + 8-bit color (256 colors), BG=0, aspect=0

    // Global Color Table (256 × 3 bytes)
    for (const c of palette) write(c[0], c[1], c[2]);

    // Graphic Control Extension
    write(0x21, 0xF9, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00);

    // Image descriptor
    write(0x2C);
    writeU16(0); writeU16(0); // position
    writeU16(width); writeU16(height);
    write(0x00); // no local color table

    // LZW encode the pixel indices
    const lzwData = this.lzwEncode(indices, 8);
    write(8); // LZW minimum code size

    // Write LZW data in sub-blocks (max 255 bytes each)
    let lzwOffset = 0;
    while (lzwOffset < lzwData.length) {
      const blockSize = Math.min(255, lzwData.length - lzwOffset);
      write(blockSize);
      for (let i = 0; i < blockSize; i++) write(lzwData[lzwOffset++]);
    }
    write(0x00); // block terminator
    write(0x3B); // GIF trailer

    return new Blob([new Uint8Array(gifBytes)], { type: 'image/gif' });
  }

  // Minimal LZW encoder for GIF
  private lzwEncode(indices: Uint8Array, minCodeSize: number): Uint8Array {
    const clearCode = 1 << minCodeSize;
    const eofCode = clearCode + 1;
    const table = new Map<string, number>();
    const resetTable = () => { table.clear(); for (let i = 0; i < clearCode; i++) table.set(String.fromCharCode(i), i); };

    let codeSize = minCodeSize + 1;
    let nextCode = eofCode + 1;
    resetTable();

    const output: number[] = [];
    let buffer = 0;
    let bitsInBuffer = 0;
    const writeCode = (code: number) => {
      buffer |= code << bitsInBuffer;
      bitsInBuffer += codeSize;
      while (bitsInBuffer >= 8) { output.push(buffer & 0xFF); buffer >>= 8; bitsInBuffer -= 8; }
    };

    writeCode(clearCode);
    let current = String.fromCharCode(indices[0]);

    for (let i = 1; i < indices.length; i++) {
      const c = String.fromCharCode(indices[i]);
      const next = current + c;
      if (table.has(next)) {
        current = next;
      } else {
        writeCode(table.get(current)!);
        table.set(next, nextCode++);
        current = c;
        if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
        if (nextCode > 4096) { writeCode(clearCode); codeSize = minCodeSize + 1; nextCode = eofCode + 1; resetTable(); }
      }
    }
    writeCode(table.get(current)!);
    writeCode(eofCode);
    if (bitsInBuffer > 0) output.push(buffer & 0xFF);
    return new Uint8Array(output);
  }

  // --- File size targeting ---

  async convertByFileSize(file: File): Promise<Blob> {
    // BMP, ICO, TIFF, GIF are lossless — skip size targeting
    if (['bmp', 'ico', 'tiff', 'gif'].includes(this.outputFormat)) {
      return this.convertFile(file, 1.0);
    }

    const targetBytes = parseFloat(this.targetFileSize) * 1024;
    let blob: Blob | null = null;
    let minQ = 0.05, maxQ = 1.0, currentQ = 0.8;
    const canvas = await this.fileToCanvas(file);

    for (let attempts = 0; attempts < 8; attempts++) {
      blob = await this.canvasToNativeBlob(canvas, this.outputFormat, currentQ);
      if (blob.size <= targetBytes * 1.1 && blob.size >= targetBytes * 0.9) break;
      if (blob.size > targetBytes) { maxQ = currentQ; } else { minQ = currentQ; }
      currentQ = (minQ + maxQ) / 2;
      if (Math.abs(maxQ - minQ) < 0.02) break;
    }

    if (blob && blob.size > targetBytes * 1.2) {
      const scaleFactor = Math.sqrt(targetBytes / (blob.size));
      const scaled = document.createElement('canvas');
      scaled.width = Math.floor(canvas.width * scaleFactor);
      scaled.height = Math.floor(canvas.height * scaleFactor);
      const ctx = scaled.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, scaled.width, scaled.height);
      ctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
      blob = await this.canvasToNativeBlob(scaled, this.outputFormat, 0.8);
    }

    return blob || await this.canvasToNativeBlob(canvas, this.outputFormat, 0.5);
  }

  // --- Helpers ---

  getMimeType(format: OutputFormat): string {
    const mimeMap: Record<OutputFormat, string> = {
      jpeg: 'image/jpeg',
      png:  'image/png',
      webp: 'image/webp',
      avif: 'image/avif',
      bmp:  'image/bmp',
      ico:  'image/x-icon',
      tiff: 'image/tiff',
      gif:  'image/gif',
    };
    return mimeMap[format] ?? 'image/jpeg';
  }

  changeExtension(filename: string, format: string): string {
    const lastDot = filename.lastIndexOf('.');
    const name = lastDot > -1 ? filename.substring(0, lastDot) : filename;
    const extMap: Record<string, string> = { jpeg: 'jpg', png: 'png', webp: 'webp', avif: 'avif', bmp: 'bmp', ico: 'ico', tiff: 'tiff', gif: 'gif' };
    return `${name}.${extMap[format] ?? format}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(id: string) { this.files.update(c => c.filter(f => f.id !== id)); }
  clearAll() { this.files.set([]); }

  downloadSingle(imageFile: ImageFile) {
    if (!imageFile.convertedBlob) return;
    const url = URL.createObjectURL(imageFile.convertedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.changeExtension(imageFile.file.name, this.outputFormat);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async downloadAllAsZip() {
    const zip = new JSZip();
    this.convertedFiles().forEach(img => {
      if (img.convertedBlob) {
        zip.file(this.changeExtension(img.file.name, this.outputFormat), img.convertedBlob);
      }
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `images-converted-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  getFormatColorClasses(color: string): string {
    const map: Record<string, string> = {
      indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
      purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
      green:  'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      orange: 'bg-orange-50 border-orange-200 hover:border-orange-400',
      cyan:   'bg-cyan-50 border-cyan-200 hover:border-cyan-400',
      red:    'bg-rose-50 border-rose-200 hover:border-rose-400',
      pink:   'bg-pink-50 border-pink-200 hover:border-pink-400',
    };
    return map[color] ?? 'bg-slate-50 border-slate-200';
  }

  getFormatTextColorClass(color: string): string {
    const map: Record<string, string> = {
      indigo: 'text-indigo-600',
      purple: 'text-purple-600',
      green:  'text-emerald-600',
      orange: 'text-orange-600',
      cyan:   'text-cyan-600',
      red:    'text-rose-600',
      pink:   'text-pink-600',
    };
    return map[color] ?? 'text-slate-600';
  }

  getUseCaseBgClass(emoji: string): string {
    const map: Record<string, string> = {
      '💼': 'bg-blue-50', '📱': 'bg-emerald-50', '📸': 'bg-purple-50', '🌐': 'bg-orange-50',
    };
    return map[emoji] ?? 'bg-slate-50';
  }
}