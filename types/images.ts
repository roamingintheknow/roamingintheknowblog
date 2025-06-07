import { BlogElement } from '@/types/blog';

export interface ImageUploadParams {
  index: number;
  url: {
    imageUrl: string;
    lowResUrl?: string;
  }| string;
  subType?: string;
  position?: number;
}

export interface UploadArgs {
  imageUrl: string;
  lowResUrl?: string;
  type: string;
  position?: number;
}

export interface ImageElementProps {
  index: number;
  onUpload: (args: { index: number; url: string; subType: string; position?: number }) => void;
  element: BlogElement;
}

export interface ImageProps {
  index: number;
  onUpload: (args: { index: number; url: string; subType: string; position?: number }) => void;
  urls: string[];
}