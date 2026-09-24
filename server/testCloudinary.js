import "dotenv/config";
import cloudinary from "./lib/cloudinary.js";

console.log("TEST FILE STARTED");

try {
    console.log("Starting upload...");

    const result = await cloudinary.uploader.upload(
        "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        {
            upload_preset: "ml_default"
        }
    );

    console.log("UPLOAD SUCCESS:", result);

} catch (error) {
    console.log("========== CLOUDINARY ERROR ==========");
    console.log("Message:", error.message);
    console.log("HTTP Code:", error.http_code);
    console.log("Name:", error.name);
    console.log("Response:", error.response);
    console.log("Response headers:", error.response?.headers);
    console.log("X-Cld-Error:", error.response?.headers?.["x-cld-error"]);
    console.log("======================================");
}