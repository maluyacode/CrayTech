import mime from "mime"

export default function imageObjectify(image) {

    if (!image || image.length <= 0) {
        return null
    }

    const newImageUri = "file:///" + image?.split("file:/").join("");

    return {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri?.split("/").pop()
    }
}

export const resolve_old_and_new_medias = ({ medias, referenceOldMedias }) => {

    return medias.reduce(
        (acc, media) => {
            if (media.includes('cloudinary')) {
                referenceOldMedias.forEach(oldMedia => {
                    if (oldMedia.url === media) {
                        acc[0].push({
                            public_id: oldMedia.public_id,
                            url: oldMedia.url
                        })
                    }
                });
            } else {
                acc[1].push(media)
            }
            return acc
        },
        [[], []]
    );
}