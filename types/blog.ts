export type ElementType ='title' | 'header' | 'sub_header' | 'body' | 'image' | 'list';
export interface BlogElement {
  id: string;
  type: ElementType;
  content: string | string[];
  subType?: string;
  imageUrls?: { imageUrl: string; lowResUrl?: string }[];
}
export interface Blog {
  _id?: string | undefined;
  elements: BlogElement[];
  title: string;
  slug: string;
  country: string;
  continent: string;
  tags: string[];    
  published: boolean;
  category: string;
  version: number;
  coverH?: string;
  coverV?: string;
  coverS?: string;
  hideTitle?: boolean;
  text?: string | string[];
}

// export interface Blog {
//   _id: string;
//   title: string;
//   slug: string;
//   elements: BlogElement[];
//   coverH?: string;
//   coverV?: string;
//   coverS?: string;
//   hideTitle: boolean;
//   tags: string[];
//   text:  string | string[];
// }