export interface ProjectImageItem {
  id: number;
  url: string;
}

export interface Project {
  id: number;
  title: string;
  shortDescription?: string;
  description: string;
  features?: string;
  icon?: string;
  tags: string[];
  stacks?: string[];
  category: string;
  github?: string;
  demo?: string;
  displayOrder?: number;
  visible: boolean;
  images: string[];
  imageItems?: ProjectImageItem[];
  createdAt?: string;
  updatedAt?: string;
  likesCount?: number;
  likedByUser?: boolean;
}

export interface NewsBroadcast {
  id: number;
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export interface ProjectRequest {
  title: string;
  shortDescription?: string;
  description: string;
  features?: string;
  icon?: string;
  category: string;
  tags?: string[];
  stacks?: string[];
  github?: string;
  demo?: string;
  displayOrder?: number;
  visible?: boolean;
}

export interface ImageUploadResponse {
  imageId: number;
  url: string;
}
