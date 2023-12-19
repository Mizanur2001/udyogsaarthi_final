import DataModel from '../models/data.js'


const searchEngine = () => {
    return {
        async searchQuary(req, res) {
            try {
                const { search } = req.body
                if (search == '') {
                    return res.status(400).send("search Key Required")
                }

                const searchWords = search.trim().split(/\s+/);
                const regexWords = searchWords.map(word => new RegExp(word, 'i'));

                const searchData = await DataModel.find({
                    "$and": searchWords.map((word, index) => ({
                        "$or": [
                            { "name": regexWords[index] },
                            { "email": regexWords[index] },
                            { "profession": regexWords[index] },
                        ]
                    }))
                });

                res.send(searchData)

            } catch (error) {
                res.status(500).send('Internal Server Error' + error)
            }
        }
    }
}

export default searchEngine
