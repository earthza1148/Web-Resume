export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  link?: string;
  createdAt: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image?: string;
  link?: string;
  createdAt: number;
}
