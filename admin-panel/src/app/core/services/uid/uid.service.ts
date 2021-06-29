import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UidService {
  constructor() {}

  async getDeviceid(): Promise<string> {
    return "test";
  }
}
