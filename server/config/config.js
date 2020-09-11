process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if(process.env.NODE_ENV === 'dev')
    process.env.URL_DB =  'mongodb://localhost:27017/cafe';
else 
    process.env.URL_DB = 'mongodb+srv://root:gwFqZB2XCVVvrpmn@cluster0.sdff1.mongodb.net/cafe';

//USUARIO MONGO ATLAS
//user root
//pass gwFqZB2XCVVvrpmn
//URL: mongodb+srv://root:<password>@cluster0.sdff1.mongodb.net/test