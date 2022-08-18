import mongoose from 'mongoose';

export function connectMongo(){
    return mongoose.connect('mongodb://localhost:27017/pet',{
        useNewUrlParser: true,
    });
}

export function insertData(arrayMatchInfo){
    return mongoose.connection.collection('pet').insertMany(arrayMatchInfo);
}