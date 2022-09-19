import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { ToTransferUseCase } from './ToTransferUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfers',
}

export class ToTransferController {

  async execute(request: Request, response: Response) {

    const { recipient_id } = request.params;
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/');
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createTransfer = container.resolve(ToTransferUseCase);

    const transfer = await createTransfer.execute({
      recipient_id,
      sender_id,
      amount,
      type,
      description
    });

    return response.status(201).json(transfer);

  }
}