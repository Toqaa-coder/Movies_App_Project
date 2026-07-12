const OMDB_API_KEY = process.env.OMDB_API_KEY;

exports.getMovieInfo = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ message: 'חסר שם סרט' });
        }

        const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
        const response = await fetch(url);
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בפנייה ל-OMDb API', error: error.message });
    }
};


