process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if(process.env.NODE_ENV === 'dev')
    process.env.URL_DB =  'mongodb://localhost:27017/cafe';
else 
    process.env.URL_DB = process.env.MONGO_URI; 

process.env.EXPIRED_TOKEN = 60*60;

process.env.SEED = process.env.NODE_ENV === 'dev' ? 'seed-de-desarrollo' : process.env.SEED;