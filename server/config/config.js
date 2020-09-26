process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if(process.env.NODE_ENV === 'dev')
    process.env.URL_DB =  'mongodb://localhost:27017/cafe';
else 
    process.env.URL_DB = process.env.MONGO_URI; 

process.env.EXPIRED_TOKEN = 60*60;

if(process.env.NODE_ENV === 'dev')
    process.env.SEED = 'seed-de-desarrollo';
else
    process.env.SEED = process.env.SEED;

process.env.CLIENT_ID = process.env.CLIENT_ID || '752413003409-a2rshoqstva9o88tmcf365tg71jjh160.apps.googleusercontent.com';