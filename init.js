<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
tinymce.init({
  selector: 'textarea',
  plugins: 'code image link media codesample',
  toolbar: 'insertfile | undo redo | link image media | code | codesample',
  height: 400,
  images_upload_url: "/EditorUpload/Post",
});
