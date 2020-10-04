/**
 * Copyright (C) 2020 Steve Calvário
 *
 * This file is part of GBC Explorer, a web multi-coin blockchain explorer.
 *
 * GBC Explorer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * GBC Explorer is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * GBC Explorer. If not, see <https://www.gnu.org/licenses/>.
 */

import { Router, Request, Response } from 'express';
import iController from '../interfaces/iController';
import swaggerUi from 'swagger-ui-express';

class Home implements iController {
  public path = ''
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getHomePage);
    this.router.use(`${this.path}/api`, swaggerUi.serve);
    this.router.get(`${this.path}/api`, swaggerUi.setup(require('../../swagger.json')));
    this.router.get(`${this.path}/faq`, this.getFAQPage);
  }

  private getHomePage = async (request: Request, response: Response) => {
    return response.render('home');
  }

  private getFAQPage = async (request: Request, response: Response) => {
    return response.render('faq');
  }
}

export default Home;