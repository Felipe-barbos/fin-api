import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({ statement, balance }: { statement: Statement[], balance: number }) {
    const parsedStatement = statement.map(({
      id,
      user_id,
      sender_id,
      receiver_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        user_id,
        sender_id,
        receiver_id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
