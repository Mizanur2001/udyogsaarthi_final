const uploadController = () => {
    return {
        uploadimg(req, res) {
            if (!req.file) {
                return res.status(400).send("No file received.");
            }
            res.send("Image upload successfully")
        }
    }
}

export default uploadController