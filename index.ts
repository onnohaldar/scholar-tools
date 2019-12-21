import * as csvtojson from 'csvtojson';

interface Article {
  authors: string;
  title: string,
  publication: string;
  volume: string,
  number: string,
  pages: string,
  year: string,
  publisher: string;
};

interface Level {
  level1: string;
  level2: string;
  level3: string
}

interface ArticleMatrix { 
  article: Article;
  levels: Level[]; 
}

csvtojson({
  delimiter: ';'
})
.fromFile('data/results.csv')
.then(results => {
  let matrixes: ArticleMatrix[] = [];
  
  for (let row of results) {
    // init row values
    const article: Article = {
      authors: row.Authors,
      title: row.Title,
      publication: row.Publication,
      volume: row.Volume,
      number: row.Number,
      pages: row.Pages,
      year: row.Year,
      publisher: row.Publisher
    };
    const level: Level = {
      level1: row.Level1,
      level2: row.Level2,
      level3: row.Level3
    };

    // check martrixes
    if (matrixes.length == 0) {
      // add first article
      matrixes.push({ article: article, levels: [level]}); 
    } else {
      // looking for existing articles
      const i = matrixes.findIndex(matrix => 
        matrix.article.authors == article.authors &&
        matrix.article.title == article.title &&
        matrix.article.publication == article.publication &&
        matrix.article.volume == article.volume &&
        matrix.article.number == article.number &&
        matrix.article.pages == article.pages &&
        matrix.article.year == article.year &&
        matrix.article.publisher == article.publisher
        );
      if (i == -1) {
        // add new article
        matrixes.push({ article: article, levels: [level]});
      } else {
        // add new level to existing article
        matrixes[i].levels.push(level);
      }
    }
  }
  console.log(matrixes);
});