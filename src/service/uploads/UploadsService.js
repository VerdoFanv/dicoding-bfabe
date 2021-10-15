const { nanoid } = require('nanoid');
const fs = require('fs');

class UploadsService {
    constructor(folder) {
        this._folder = folder;

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    uploadFile(file, meta) {
        const filename = nanoid(10) + meta.filename;
        const directory = `${this._folder}/${filename}`;

        const fileStream = fs.createWriteStream(directory);

        return new Promise((resolve, reject) => {
            fileStream.on('error', (error) => reject(error));

            file.pipe(fileStream);
            file.on('end', () => resolve(filename));
        });
    }
}

module.exports = UploadsService;
