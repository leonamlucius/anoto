export interface Folder {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
  noteIds: number[];
}
