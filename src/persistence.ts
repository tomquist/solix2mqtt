import { LoginResultResponse } from "./api";
import { promises as fs } from "fs";

export interface Persistence<T> {
  store(data: T): Promise<void>;
  retrieve(): Promise<T | null>;
}

export class FilePersistence<T> implements Persistence<T> {
  constructor(private readonly path: string) {}
  
  async store(data: T): Promise<void> {
    await fs.writeFile(this.path, JSON.stringify(data), "utf8");
  }
  
  async retrieve(): Promise<T | null> {
    try {
      const data = await fs.readFile(this.path, "utf8");
      return JSON.parse(data) as T;
    } catch (err) {
      if ((err as any).code === "ENOENT") {
        return null;
      } else {
        throw err;
      }
    }
  }
}