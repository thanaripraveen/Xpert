import { Component } from '@angular/core';

@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrl: './createtask.component.scss'
})
export class CreatetaskComponent {

  insertScreenshot() {
    // Simulate taking a screenshot (use a real screenshot library here if needed)
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
  

    // Convert canvas to Blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);

        // Insert image into the contenteditable div
        const editableDiv = document.getElementById('editableDiv');
        if (editableDiv) {
          const img = document.createElement('img');
          img.src = url;
          img.style.maxWidth = '100%'; // Ensure the image fits within the div
          editableDiv.appendChild(img);
          console.log(editableDiv.appendChild(img))
        }
      }
    });
  }

}
