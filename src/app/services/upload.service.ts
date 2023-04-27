import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Upload } from 'models/upload';

import { environment } from '../../environments/environment';


const API_ENDPOINT = environment.apiEndpoint;

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}

  generatePresignedUrl(type: string): Observable<Upload> {
    const filename = 'Video.mp4';
    return this.http.post<Upload>(`${API_ENDPOINT}/upload`, {filename, ContentType: type});
  }

  upload (url, file, fileID, uploadProgress): {xhr: XMLHttpRequest, promise: Promise<any>} {
    const xhr = new XMLHttpRequest();
    const promise = new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', uploadProgress, false);
      xhr.open('PUT', `${url}`);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.addEventListener('load', () => {
        resolve(fileID);
      }, false);
      xhr.addEventListener('error', () => {
        reject('Server error');
      }, false);
      xhr.send(file);
    });
    return { xhr, promise };
  }

}
