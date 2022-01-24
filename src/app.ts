import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import config from './config/config';
import database from './loaders/database';
import authentication from './loaders/authentication';
import {errorHandler} from './middlewares/errorMiddleware';
import {notFoundHandler} from "./middlewares/notFoundMiddleware";

const startServer = async () => {
    const app = express();

    await database();
    await authentication(app);

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    routes(app);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(config.port, () => {
        console.log(`node_env = ${config.env}`);
        console.log(`Listening on port ${config.port}`);
    });
};

startServer().catch((e) => console.error('Error when starting server', e));
