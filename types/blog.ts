export interface BlogElement {
  type: 'title' | 'header' | 'sub_header' | 'body' | 'image' | 'list';
  content: string | string[];
  subType?: string;
  imageUrls?: { imageUrl: string; lowResUrl?: string }[];
}

export interface Blog {
  elements: BlogElement[];
  coverH?: string;
  coverV?: string;
  coverS?: string;
}