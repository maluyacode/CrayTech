const path = 'public/uploads/'
const cloudinary = require('cloudinary')

const uploadSingle = async ({ imageFile, request }) => {

    const result = await cloudinary.v2.uploader.upload(imageFile, {
        folder: `cray-tech`,
    });

    return {
        public_id: result.public_id,
        url: result.secure_url,
    }
}

const uploadMultiple = async ({ mediaFiles, request }) => {

    let images = []
    for (let i = 0; i < mediaFiles.length; i++) {

        let image = mediaFiles[i].path;

        const result = await cloudinary.v2.uploader.upload(image, {
            folder: `cray-tech`,
            resource_type: 'auto'
        });

        images.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }

    return images
}

module.exports = {
    uploadMultiple,
    uploadSingle
}