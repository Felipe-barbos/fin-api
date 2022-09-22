import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { OperationType } from '../../entities/Statement';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { ToTransferUseCase } from './ToTransferUseCase';



export class ToTransferController {

  async execute(request: Request, response: Response): Promise<Response> {

    const { user_id } = request.params;
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;



    const splittedPath = request.originalUrl.split('/');
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransfer = container.resolve(ToTransferUseCase);


    const transfer = await createTransfer.execute({
      user_id,
      sender_id,
      amount,
      description
    });

    return response.status(201).json(transfer);

  }
}