import { Connection, createConnection, getConnectionOptions } from 'typeorm';



export async function Conected(host = "database"): Promise<Connection> {


  const defaultOption = await getConnectionOptions();

  const teste = createConnection(
    Object.assign(defaultOption, {
      host,
      database: process.env.NODE_ENV === "test" ? "fin_api_test" : defaultOption.database,
    })
  );

  console.log(defaultOption);

  return teste;
}