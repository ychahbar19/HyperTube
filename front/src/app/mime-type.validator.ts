import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  const file = control.value as File;
  let frObs;
  
  if (file !== null) {
    const fileReader = new FileReader();

    frObs = new Observable((observer: Observer<{[key: string]: any}>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = '';
        let isValid = false;

        for (const item of arr) {
          header += item.toString(16);
        }

        switch (header) {
          case '89504e47':
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8': isValid = true; break;
          default: isValid = false; // Or you can use the blob.type as fallback
        }
        if (isValid) { observer.next(null); } else { observer.next({ invalidMimeType: true }); }
        observer.complete();
      });
      if (file) { fileReader.readAsArrayBuffer(file); }
    });
    return frObs;
  } 
  frObs = new Observable((observer: Observer<{[key: string]: any}>) => {
    observer.next(null);
    observer.complete();
  });
  return frObs;
};
