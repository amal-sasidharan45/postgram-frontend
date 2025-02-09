import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimetype = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  // If the value is a string, it means it's already a URL or something else, no need to validate
  if (typeof control.value === "string") {
    return of({});
  }

  // If the value is an array (files), we need to validate each file
  const files = control.value as File[];
  if (!Array.isArray(files) || files.length === 0) {
    return of({});
  }

  const frObs = new Observable((observer: Observer<{ [key: string]: any }>) => {
    let validFilesCount = 0;
    const invalidFilesCount = files.length;

    files.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.addEventListener("loadend", () => {
        const result = fileReader.result;
        
        // Check if result is an ArrayBuffer
        if (result && result instanceof ArrayBuffer) {
          const arr = new Uint8Array(result).subarray(0, 4);
          let header = "";
          let isValid = false;
          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
          }

          // Check the header to validate the MIME type
          switch (header) {
            case "89504e47": // PNG
            case "ffd8ffe0": // JPEG
            case "ffd8ffe1": 
            case "ffd8ffe2": 
            case "ffd8ffe3": 
            case "ffd8ffe8":
              isValid = true;
              break;
            default:
              isValid = false;
              break;
          }

          // If valid, increment valid count
          if (isValid) {
            validFilesCount++;
          } else {
            observer.next({ invalidMimeType: true });
          }

          // If all files are processed, complete the observer
          if (validFilesCount === invalidFilesCount) {
            observer.complete();
          }
        } else {
          // If result is null or not an ArrayBuffer, invalid file
          observer.next({ invalidMimeType: true });
          observer.complete();
        }
      });
      fileReader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    });
  });

  return frObs;
};
