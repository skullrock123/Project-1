import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../model/file-handle.model';

@Injectable({
  providedIn: 'root',
})
export class ImageProcessingService {
  constructor(private sanitizer: DomSanitizer) {}

  createImages(user: any) {
    const imageFileData = user.userImage;
    const imageBlob = this.dataURItoBlob(
      imageFileData.picByte,
      imageFileData.type
    );
    const imagefile = new File([imageBlob], imageFileData.name, {
      type: imageFileData.type,
    });
    const finalFileHandle: FileHandle = {
      file: imagefile,
      url: this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(imagefile)
      ),
    };
    // const userImageToFileHandle:FileHandle = finalFileHandle;
    user.userImage = finalFileHandle;
    return user;
  }

  dataURItoBlob(picBytes: any, imageType: any) {
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: imageType });
    return blob;
  }
}
