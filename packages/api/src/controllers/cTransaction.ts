import { Router, Request, Response } from 'express';
import { getRepository } from "typeorm";
import iController from '../interfaces/iController';
import stringValidator from '../middlewares/mStringValidator';
import { mTransaction } from '@calvario/gbc-explorer-shared';
import debug from 'debug';

class Transaction implements iController {
  public path = '/rest/api/1/transaction';
  public router = Router();
  private repository = getRepository(mTransaction);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, stringValidator(), this.getLatestTransactions);
    this.router.get(`${this.path}/:hash`, stringValidator(), this.getTransactionByHash);
  }

  private getLatestTransactions = async (request: Request, response: Response) => {
    const qB = this.repository.createQueryBuilder("transaction")
    .innerJoinAndSelect("transaction.block", "block")
    .where("block.onMainChain = true")
    .orderBy("block.height", "DESC")
    if (request.query.afterId !== undefined) qB.andWhere("transaction.id < " + request.query.afterId.toString());
    request.query.limit === undefined || Number(request.query.limit) > 100 ? qB.limit(10) : qB.limit(Number(request.query.limit.toString()));

    await qB.getMany()
    .then(transactions => {
      return response.json(transactions);
    })
    .catch((error) => {
      debug.log(error);
      return response.sendStatus(500)
    });
  }

  private getTransactionByHash = async (request: Request, response: Response) => {
    const hashParam = request.params.hash;
    await this.repository.createQueryBuilder("transaction")
    .innerJoinAndSelect("transaction.block", "block")
    .innerJoinAndSelect("transaction.vins", "vin")
    .leftJoinAndSelect("vin.vout", "vinvout")
    .leftJoinAndSelect("vinvout.transaction", "vintransaction")
    .leftJoinAndSelect("vinvout.addresses", "vinaddress")
    .innerJoinAndSelect("transaction.vouts", "vout")
    .innerJoinAndSelect("vout.addresses", "address")
    .leftJoinAndSelect("vout.vin", "voutvin")
    .leftJoinAndSelect("voutvin.transaction", "voutvintransaction")
    .where("transaction.hash = :hash", { hash: hashParam })
    .orderBy("vin.id", "ASC")
    .addOrderBy("vout.n", "ASC")
    .getOne()
    .then( transaction => {
      return response.json(transaction);
    })
    .catch((error) => {
      debug.log(error);
      return response.sendStatus(404)
    });
  }
}

export default Transaction;