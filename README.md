# TinyMCE-image-upload-on-ASP.NET-Core
- add html codes below to your view
```html
<form method="post">
      <textarea id="mytextarea">Hello, World!</textarea>
</form>
```
- Copy init.js to your wwroot directory
```javascript
<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
tinymce.init({
  selector: 'textarea',
  plugins: 'code image link media codesample',
  toolbar: 'insertfile | undo redo | link image media | code | codesample',
  height: 400,
  images_upload_url: "/EditorUpload/Post",
});
```
- Copy EditorUploadController.cs to your controller directory
     ```csharp
     public class EditorUploadController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public EditorUploadController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost]
        [Produces("application/json")]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            // Get the file from the POST request
            var theFile = HttpContext.Request.Form.Files.GetFile("file");

            // Get the server path, wwwroot
            string webRootPath = _hostingEnvironment.WebRootPath;

            // Building the path to the uploads directory
            var fileRoute = Path.Combine(webRootPath, "uploads");

            // Get the mime type
            var mimeType = HttpContext.Request.Form.Files.GetFile("file").ContentType;

            // Get File Extension
            string extension = System.IO.Path.GetExtension(theFile.FileName);

            // Generate Random name.
            string name = Guid.NewGuid().ToString().Substring(0, 8) + extension;

            // Build the full path inclunding the file name
            string link = Path.Combine(fileRoute, name);

            // Create directory if it does not exist.
            FileInfo dir = new FileInfo(fileRoute);
            dir.Directory.Create();

            // Basic validation on mime types and file extension
            string[] imageMimetypes =
                {"image/gif", "image/jpeg", "image/pjpeg", "image/x-png", "image/png", "image/svg+xml"};
            string[] imageExt = {".gif", ".jpeg", ".jpg", ".png", ".svg", ".blob"};

            try
            {
                if (Array.IndexOf(imageMimetypes, mimeType) >= 0 && (Array.IndexOf(imageExt, extension) >= 0))
                {
                    // Copy contents to memory stream.
                    Stream stream;
                    stream = new MemoryStream();
                    theFile.CopyTo(stream);
                    stream.Position = 0;
                    String serverPath = link;

                    // Save the file
                    using (FileStream writerFileStream = System.IO.File.Create(serverPath))
                    {
                        await stream.CopyToAsync(writerFileStream);
                        writerFileStream.Dispose();
                    }

                    // Return the file path as json
                    Hashtable location = new Hashtable();
                    location.Add("location", "/uploads/" + name);
                    return Json(location);
                }
                throw new ArgumentException("The image did not pass the validation");
            }
            catch (ArgumentException ex)
            {
                return Json(ex.Message);
            }
        }
    }
     ```
    
