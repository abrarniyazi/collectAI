export interface ApiRequest {
  email: string;
  text: string;
}

export interface ApiResponse {
  email: string;
  text: string;
  paid: boolean;
}

export const baseUrl: string = 'http://localhost:9090';
