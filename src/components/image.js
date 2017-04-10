let imgHeight;
let imgWidth;

function findHeightWidth() {
  imgHeight = this.height;
  imgWidth = this.width;
  return true;
}

export default {
  newImage (src) {
    let myImage = new Image();
    myImage.name = src;
    myImage.onload = findHeightWidth;
    myImage.src = src;
    return myImage;
  }
}
