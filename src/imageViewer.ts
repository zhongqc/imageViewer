/**
 * Created by Zhongqc on 2017/7/7.
 */
class imageViewer {
    images: Array<string>;
    minScale: number;
    maxScale: number;
    showIndex: number;

    constructor(images: Array<string>, minScale: number = 1, maxScale: number = 3, showIndex: number = 0) {
        this.images = images;
        this.minScale = minScale;
        this.maxScale = maxScale;
        this.showIndex = showIndex;
        this.showImages();
    }

    showImages() {
        let imageViewerContent = document.createElement("div");
        imageViewerContent.id = "imageViewer";
        for (let i: number = 0; i++; i < this.images.length) {
            imageViewerContent.appendChild(this.getImageCell(i));
        }
        document.getElementsByTagName("body")[0].appendChild(imageViewerContent);
    }

    getImageCell(i: number) {
        let imgCell = document.createElement("div");
        imgCell.className = "imgCell";
        let img = document.createElement("img");
        img.src = this.images[i];
        imgCell.appendChild(img);
        return imgCell;
    }

    showIndexImage() {
        this.showIndex = this.showIndex % this.images.length;

    }

    unbindTouchEvent() {
        document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].removeEventListener("touchstart", this.imageShowTouchStart, false);
    }

    imageShowTouchStart(e: TouchEvent) {
        if (e.touches.length >= 2) {
            let startPoints = e.touches;
            document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].removeEventListener("touchmove", this.imageShowTouchScale, false);
        } else {

        }
    }

    imageShowTouchScale(e: TouchEvent) {

    }
}