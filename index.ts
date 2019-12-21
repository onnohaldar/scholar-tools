import * as csvtojson from 'csvtojson';
import { writeFileSync } from 'fs';

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
  id: string;
  subLevels?: Level[];
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
    const levels: Level[] = [ 
      { id: row.Level1, subLevels: [ 
        { id: row.Level2, subLevels: [
          { id: row.Level3 }
        ] } ] } ];
        
    // check martrixes
    if (matrixes.length == 0) {
      // add first article
      matrixes.push({ article: article, levels: levels}); 
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
        matrixes.push({ article: article, levels: levels});
      } else {
        // add new level(n) to article
        const iL1 = matrixes[i].levels.findIndex(level => level.id == levels[0].id);
        if (iL1 == -1) {
          // add new level 1 (to article)
          matrixes[i].levels.push(levels[0]);
        } else {
          const iL2 = matrixes[i].levels[iL1].subLevels.findIndex(level => level.id == row.Level2);
          if (iL2 == -1) {
            // add new level 2 (to level 1 of article)
            matrixes[i].levels[iL1].subLevels.push({ id: row.Level2, subLevels: [
              { id: row.Level3 }
            ] });
          } else {
            // add new level 3 (to level 2 of article)
            matrixes[i].levels[iL1].subLevels[iL2].subLevels.push({ id: row.Level3 });
          }
        }
      }
    }
  }
  writeFileSync('data/matrixes.json', JSON.stringify(matrixes, null, 2));
});