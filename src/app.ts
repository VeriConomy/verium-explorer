import * as bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import iController from './interfaces/iController';
import debug from 'debug';
import 'reflect-metadata';

class App {
  public app: express.Application;

  constructor(controllers: iController[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(process.env.APP_PORT, () => {
      debug.log(`App listening on the port ${process.env.APP_PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'pug');
    this.app.use('/', express.static(path.join(__dirname, '../public')));
    this.app.use(logger(':remote-addr - [:date[clf]] :status ":method :url" :res[content-length] ":referrer" :response-time ms - :res[content-length]'));
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: iController[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
}

export default App;