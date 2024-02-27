import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

class FileWrapper {
    public file: File;
    public previewUrl: string;

    constructor(file: File) {
      this.file = file;
      this.previewUrl = URL.createObjectURL(file);
    }
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  defaultButton = `
    text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
    font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 
    dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`;
  public fileWrappers: FileWrapper[] = [];

  constructor(private http: HttpClient, private changeDetector: ChangeDetectorRef) { }

  public onEvent(event: Event) {
    // Prevent the browser from opening the file
    event.preventDefault();

    // Get the dropped files
    const rawFiles = (event.target as HTMLInputElement).files;

    console.log(rawFiles);
    if (rawFiles && rawFiles.length > 0) {
      Array.from(rawFiles).forEach(e => {
        if (!this.fileWrappers.some(o => o.file.name == e.name)) {
          this.fileWrappers.push(new FileWrapper(e));
        }
      });
    }
    // for (const file of files) {
    //   if (file.isFile) {
    //     debugger;
        // const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        // fileEntry.file((file: File) => {
        //   // Add the actual File object to the array
        //   this.actualFiles.push(file);
        //   debugger;
        //   // Manually trigger change detection
        //   this.changeDetector.detectChanges();
        // });
      // }
    // }
  }

  public uploadFiles() {
    console.log("upload");
    if (this.fileWrappers.length) {
      const formData = new FormData();
      for (let fwps of this.fileWrappers) {
        formData.append('files', fwps.file, fwps.file.name);
      }

      this.http.post('http://localhost:3001/api/upload', formData).subscribe({
        next: data => {
          //do something, if upload success
          console.log("Upload successful");
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }
}
