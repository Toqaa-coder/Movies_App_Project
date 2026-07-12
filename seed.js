global.crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('./models/postModel');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Post.deleteMany({});
  await Post.insertMany([
    {title:'The WONDERfools',year:'2026',genre:'Fantasy',type:'Series',img:'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/The_Wonderfools_poster.png/250px-The_Wonderfools_poster.png',row:'trending'},
    {title:'The Last of Us',year:'2023',genre:'Drama',type:'Series',img:'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',row:'trending'},
    {title:'Breaking Bad',year:'2008',genre:'Crime',type:'Series',img:'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',row:'trending'},
    {title:'Inception',year:'2010',genre:'Action',type:'Movie',img:'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',row:'trending'},
    {title:'The Crown',year:'2016',genre:'Drama',type:'Series',img:'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',row:'trending'},
    {title:'Squid Game',year:'2021',genre:'Thriller',type:'Series',img:'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',row:'trending'},
    {title:'The Witcher',year:'2019',genre:'Fantasy',type:'Series',img:'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',row:'trending'},
    {title:'Interstellar',year:'2014',genre:'Sci-Fi',type:'Movie',img:'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',row:'trending'},
    {title:'Stranger Things',year:'2016',genre:'Sci-Fi',type:'Series',img:'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',row:'trending'},
    {title:'Love is Blind',year:'2020',genre:'Reality',type:'Series',img:'https://m.media-amazon.com/images/M/MV5BNDk5OGRjZDEtMjc3Yi00Y2QxLWI3ZmYtNDY2NmYyMzlhZWU3XkEyXkFqcGc@._V1_.jpg',row:'reality'},
    {title:'Building the Band',year:'2024',genre:'Reality',type:'Series',img:'https://m.media-amazon.com/images/M/MV5BY2Q3MWNmMzQtZGIwMC00ZDJkLWE5MmEtMTdmYTBkOGJmZWE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',row:'reality'},
    {title:'Perfect Match',year:'2023',genre:'Reality',type:'Series',img:'https://upload.wikimedia.org/wikipedia/en/7/7b/Perfect_Match_2023.png',row:'reality'},
    {title:'The Circle',year:'2020',genre:'Reality',type:'Series',img:'https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/The_Circle_Season_3.jpeg/250px-The_Circle_Season_3.jpeg',row:'reality'},
    {title:'Indian Matchmaking',year:'2020',genre:'Reality',type:'Series',img:'https://m.media-amazon.com/images/M/MV5BYTgwYTVhMTUtMjAyMi00Y2MxLTg4NWQtNjU1Nzg1NTkyNmEzXkEyXkFqcGc@._V1_.jpg',row:'reality'},
    {title:'The Sandman',year:'2022',genre:'Fantasy',type:'Series',img:'https://image.tmdb.org/t/p/w500/q54qEgagGOYCq5D1903eBVMNkbo.jpg',row:'continue',progress:80},
    {title:'Wednesday',year:'2022',genre:'Comedy',type:'Series',img:'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',row:'continue',progress:45},
    {title:'Bridgerton',year:'2020',genre:'Romance',type:'Series',img:'https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg',row:'continue',progress:100},
    {title:'Money Heist',year:'2017',genre:'Crime',type:'Series',img:'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',row:'continue',progress:20}
  ]);
  console.log('Done! Added 18 posts');
  process.exit();
});