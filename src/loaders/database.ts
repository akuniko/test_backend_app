import mongoose from 'mongoose';
import config from '../config/config';

export default async (): Promise<void> => {
    console.log('Database connecting');
    await mongoose
        .connect(config.databaseURL, {
            useNewUrlParser: true,
            autoCreate: true
        })
        .then(() => {
            console.log('Successfully connect to MongoDB.');
        })
        .catch((err: TypeError) => {
            console.error('Connection error', err);
            process.exit();
        });
};
