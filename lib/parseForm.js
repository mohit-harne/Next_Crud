import formidable from 'formidable';

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    // Create a new Form instance directly
    const form = new formidable.IncomingForm();

    form.keepExtensions = true; // Keep file extensions
    form.uploadDir = './public/uploads'; // Optional: Customize where to save uploads

    // Parse the incoming form request
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err); // Reject promise on error
      } else {
        resolve({ fields, files }); // Resolve promise with parsed data
      }
    });
  });
};

export default parseForm;
