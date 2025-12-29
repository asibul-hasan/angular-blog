import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import JSZip from 'jszip';

// --- Interfaces ---
interface ImageFile {
  id: string;
  file: File;
  preview: string; // Data URL for display
  status: 'pending' | 'converting' | 'completed' | 'error';
  convertedBlob?: Blob;
  convertedPreview?: string;
  compressedSize?: number;
  error?: string;
}

interface DropdownOption {
  name: string;
  value: string | number;
}

@Component({
  selector: 'app-image-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-converter.component.html',
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  `]
})
export class ImageConverterComponent implements OnInit {
  // State
  files: ImageFile[] = [];
  dragActive = false;
  converting = false;

  // Settings
  outputFormat = 'jpeg';
  compressionMode = 'quality';
  quality = 0.9;
  targetFileSize = 200; // KB

  // Dropdown Options
  readonly imageType: DropdownOption[] = [
    { name: 'JPEG', value: 'jpeg' },
    { name: 'PNG', value: 'png' },
    { name: 'WebP', value: 'webp' },
    { name: 'BMP', value: 'bmp' }
  ];

  readonly compressionModeList: DropdownOption[] = [
    { name: 'By Quality', value: 'quality' },
    { name: 'Target File Size', value: 'filesize' }
  ];

  readonly qualityList: DropdownOption[] = [
    { name: 'Maximum (100%)', value: 1.0 },
    { name: 'Very High (90%)', value: 0.9 },
    { name: 'High (80%)', value: 0.8 },
    { name: 'Medium (60%)', value: 0.6 },
    { name: 'Low (40%)', value: 0.4 }
  ];

  readonly targetSizeList: DropdownOption[] = [
    { name: '50 KB', value: 50 },
    { name: '100 KB', value: 100 },
    { name: '200 KB', value: 200 },
    { name: '500 KB', value: 500 },
    { name: '1 MB', value: 1024 },
    { name: '2 MB', value: 2048 }
  ];

  readonly features = signal([
    {
      title: 'Universal Format Support',
      description: 'Convert between JPG, PNG, WebP, BMP and more. Supports high-quality output for photographers and designers.',
      icon: 'convert',
    },
    {
      title: 'Smart Optimization',
      description: 'Our engine balances quality and file size intelligently. Get the perfect image for web or print instantly.',
      icon: 'star',
    },
    {
      title: '100% Secure & Private',
      description: 'Your photos never leave your browser. All processing happens on your device using advanced client-side technology.',
      icon: 'shield',
    }
  ]);

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Free Image Converter Pro - Convert & Compress Locally');
    this.metaService.addTags([
      { name: 'description', content: 'Convert JPG, PNG, WebP images locally in your browser. Free, secure, and fast image converter with compression tools.' },
      { name: 'keywords', content: 'image converter, jpg to png, webp to jpg, image compressor, client side converter' }
    ]);
  }

  get convertedFiles() {
    return this.files.filter(f => f.status === 'completed');
  }

  // --- Event Handlers ---

  handleDrag(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      this.dragActive = true;
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      this.dragActive = false;
    }
  }

  handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dragActive = false;
    if (e.dataTransfer?.files) {
      this.processFiles(e.dataTransfer.files);
    }
  }

  handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
    }
    input.value = ''; // Reset input
  }

  processFiles(fileList: FileList) {
    Array.from(fileList).forEach(file => {
      // Validate is image
      if (!file.type.match('image.*')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageFile: ImageFile = {
          id: Math.random().toString(36).substr(2, 9),
          file: file,
          preview: e.target?.result as string,
          status: 'pending'
        };
        this.files.push(imageFile);
      };
      reader.readAsDataURL(file);
    });
  }

  onCompressionModeChange() {
    // Logic if needed when mode changes
  }

  // --- Conversion Logic ---

  async convertImages() {
    this.converting = true;

    for (const imageFile of this.files) {
      if (imageFile.status === 'completed') continue;

      imageFile.status = 'converting';
      this.cdr.detectChanges(); // Trigger UI update

      try {
        let convertedBlob: Blob;

        if (this.compressionMode === 'filesize') {
          convertedBlob = await this.convertImageByFileSize(imageFile.file);
        } else {
          convertedBlob = await this.convertImageByQuality(imageFile.file);
        }

        imageFile.convertedBlob = convertedBlob;
        imageFile.compressedSize = convertedBlob.size;
        imageFile.status = 'completed';

        // Generate preview for the new blob (optional, helps verify conversion)
        const reader = new FileReader();
        reader.onload = (e) => {
          imageFile.convertedPreview = e.target?.result as string;
        };
        reader.readAsDataURL(convertedBlob);

      } catch (error) {
        imageFile.status = 'error';
        imageFile.error = 'Conversion failed';
        console.error('Error converting image:', error);
      }
    }

    this.converting = false;
    this.cdr.detectChanges();
  }

  convertImageByQuality(file: File): Promise<Blob> {
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

        ctx.drawImage(img, 0, 0);

        // Canvas export
        canvas.toBlob((blob) => {
          blob ? resolve(blob) : reject(new Error('Blob creation failed'));
        }, `image/${this.outputFormat}`, this.quality);
      };

      img.onerror = () => reject(new Error('Image load failed'));
      reader.readAsDataURL(file);
    });
  }

  async convertImageByFileSize(file: File): Promise<Blob> {
    const targetBytes = this.targetFileSize * 1024;
    let blob: Blob | null = null;
    let attempts = 0;
    const maxAttempts = 8;

    // Binary search variables
    let minQ = 0.05;
    let maxQ = 1.0;
    let currentQ = 0.8;

    while (attempts < maxAttempts) {
      blob = await this.convertImageByQualityValue(file, currentQ);

      // Allow 10% margin of error
      if (blob.size <= targetBytes * 1.1 && blob.size >= targetBytes * 0.9) break;

      if (blob.size > targetBytes) {
        maxQ = currentQ;
      } else {
        minQ = currentQ;
      }

      currentQ = (minQ + maxQ) / 2;
      attempts++;

      if (Math.abs(maxQ - minQ) < 0.02) break; // Optimization step
    }

    // If still too big, force resize (scale down dimensions)
    if (blob && blob.size > targetBytes * 1.2) {
      blob = await this.convertAndResizeImage(file, targetBytes);
    }

    // Fallback
    return blob || await this.convertImageByQualityValue(file, 0.5);
  }

  convertImageByQualityValue(file: File, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target?.result as string; };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject('No context'); return; }
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(blob => {
          blob ? resolve(blob) : reject('Blob error');
        }, `image/${this.outputFormat}`, quality);
      };

      reader.readAsDataURL(file);
    });
  }

  async convertAndResizeImage(file: File, targetBytes: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target?.result as string; };

      img.onload = () => {
        // Calculate scale required
        const scaleFactor = Math.sqrt(targetBytes / file.size);
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(img.width * scaleFactor);
        canvas.height = Math.floor(img.height * scaleFactor);

        const ctx = canvas.getContext('2d');
        if (!ctx) { reject('No context'); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
          blob ? resolve(blob) : reject('Resize blob error');
        }, `image/${this.outputFormat}`, 0.8);
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Download Utilities ---

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
    this.convertedFiles.forEach((img) => {
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

  // --- Helpers ---

  removeFile(id: string) {
    this.files = this.files.filter(f => f.id !== id);
  }

  clearAll() {
    this.files = [];
  }

  allConverted(): boolean {
    return this.files.length > 0 && this.files.every(f => f.status === 'completed' || f.status === 'error');
  }

  changeExtension(filename: string, newExt: string): string {
    const lastDot = filename.lastIndexOf('.');
    const name = lastDot > -1 ? filename.substring(0, lastDot) : filename;
    // Fix jpeg extension for consistency
    const ext = newExt === 'jpeg' ? 'jpg' : newExt;
    return `${name}.${ext}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}