import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private apiKey: string | null = null;

  constructor() {
    this.loadApiKey();
  }

  private loadApiKey() {
    // 1. Try env var
    if (process.env.API_KEY) {
      this.apiKey = process.env.API_KEY;
      return;
    }

    // 2. Try file (Docker Swarm Secret)
    if (process.env.API_KEY_FILE) {
      try {
        if (fs.existsSync(process.env.API_KEY_FILE)) {
          this.apiKey = fs
            .readFileSync(process.env.API_KEY_FILE, 'utf8')
            .trim();
        }
      } catch (e) {
        console.error(
          `Failed to load API key from file ${process.env.API_KEY_FILE}`,
          e,
        );
      }
    }
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.apiKey) {
      return true; // No API Key configured, allow all
    }

    const request = context.switchToHttp().getRequest<Request>();
    const requestKey = request.headers['x-api-key'];

    if (requestKey === this.apiKey) {
      return true;
    }

    throw new UnauthorizedException('Invalid or missing API Key');
  }
}
