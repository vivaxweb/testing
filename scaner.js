document.addEventListener("DOMContentLoaded", function () {
    let video = document.getElementById("video");
    let captureBtn = document.getElementById("capture-btn");
    let extractBtn = document.getElementById("extract-btn");
    let canvas = document.getElementById("canvas");
    let resultSpan = document.getElementById("result");
    let capturedImage = document.getElementById("captured-image");

    // Start webcam stream
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.error("Error accessing webcam:", error);
        });

    // Step 1: Capture photo from video
    captureBtn.addEventListener("click", function () {
        let ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Preprocess image before OCR
        preprocessImage(canvas);

        // Convert canvas to image and show preview
        let imageData = canvas.toDataURL("image/png");
        capturedImage.src = imageData;
        capturedImage.style.display = "block";  // Show captured image
        extractBtn.style.display = "inline-block";  // Show extract button
    });

    // Step 2: Extract ID number using OCR
    extractBtn.addEventListener("click", function () {
        Tesseract.recognize(canvas, 'eng', {
            logger: m => console.log(m), // Show OCR progress
            tessedit_char_whitelist: '0123456789' // Only allow numbers
        }).then(({ data: { text } }) => {
            console.log("OCR Full Text:", text); // Debugging - check full OCR text

            let idNumber = extractSevenDigitNumber(text);
            resultSpan.innerText = idNumber || "ID Number Not Found!";
        }).catch(error => console.error("OCR Error:", error));
    });
});

// Function to preprocess the image (grayscale & binarization)
function preprocessImage(canvas) {
    let ctx = canvas.getContext("2d");
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Convert to grayscale and binarize
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // Grayscale
        data[i] = data[i + 1] = data[i + 2] = avg > 128 ? 255 : 0; // Binarization
    }

    ctx.putImageData(imageData, 0, 0);
}

// Function to extract 7-digit ID number from OCR text
function extractSevenDigitNumber(text) {
    text = text.replace(/\s+/g, ' ').trim().toUpperCase(); // Normalize spaces & uppercase

    console.log("Cleaned OCR Text:", text); // Debugging

    let match = text.match(/\b\d{7}\b/); // Find exactly 7-digit number
    console.log("Matched 7-digit ID:", match ? match[0] : "Not Found!"); // Debugging

    return match ? match[0] : null; // Return found ID or null
}



// vivax
extractBtn.addEventListener("click", function () {
    Tesseract.recognize(canvas, 'eng', {
        logger: m => console.log(m),
        tessedit_char_whitelist: '0123456789'
    }).then(({ data: { text } }) => {
        let idNumber = extractSevenDigitNumber(text);
        if (idNumber) {
            localStorage.setItem("scannedID", idNumber); // Store scanned ID
            window.location.href = "form.html"; // Redirect back to form page
        } else {
            resultSpan.innerText = "ID Number Not Found!";
        }
    }).catch(error => console.error("OCR Error:", error));
});
