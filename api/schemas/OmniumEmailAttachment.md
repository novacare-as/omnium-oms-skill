# OmniumEmailAttachment

Attachment to emailmessage. There are two separate ways of using this model - Url or Base64EncodedContent.
1. Url - If you your attachment is already located in omnium specify the resource url of the attachment.
2. Base64EncodedContent - You can add the attachment as a Base64Encoded string. (Max length is set to  100 000)

**Fields:**

- `fileName`: string, nullable — Attachment name
- `contentType`: string, nullable — File type, e.g. image/jpg
- `fileUrl`: string, nullable — Url pointing to blob in omnium storage containing the file to attach
- `base64EncodedContent`: string, nullable — File content base64-encoded
