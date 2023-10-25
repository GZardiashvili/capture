import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploaderService {
  constructor(private http: HttpClient) {}
  uploadImage(imageData: string) {
    const requestBody = { imagePath: imageData };

    return this.http.post('http://localhost:3000/upload', requestBody).pipe(
      tap((data) => {
        console.log('Image uploaded to Cloudinary:', data);
      }),
      catchError((error) => {
        console.error('Error uploading image to Cloudinary:', error);
        return throwError('Error uploading image to Cloudinary');
      })
    );
  }
}
