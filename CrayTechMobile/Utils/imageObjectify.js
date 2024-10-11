import mime from "mime"

export default function imageObjectify(image) {

    if (!image) {
        return null
    }

    const newImageUri = "file:///" + image?.split("file:/").join("");

    return {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri?.split("/").pop()
    }
}
