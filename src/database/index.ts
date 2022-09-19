import { Connection, createConnection, getConnectionOptions } from 'typeorm';



export default async (host = "localhost"): Promise<Connection> => {


  const defaultOption = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOption, {
      host,
      database: process.env.NODE_ENV === "test" ? "fin_api_test" : defaultOption.database,
    })
  );


}