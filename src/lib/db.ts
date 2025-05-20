import dbi from './dbcon';
// import type { RowDataPacket } from 'mysql2';

// type User = {
//   userNumber: number;
//   userName: string;
//   userPhone: string;
//   userEmail: string;
//   userPassword: string;
//   settingName: string;
// };

// type Server = {
//   serverNumber: number;
//   userNumber: number;
//   serverName: string;
//   serverAddr: string;
//   serverType: string;
//   status: string;
//   createdAt: Date;
// };

async function select(sql: string, params: any[] = []) {
  const [rows] = await dbi.query(sql, params);
  return rows;
}

export async function selecta(column: string) {
  if(column=='U'){
    return await select(`SELECT * FROM User`);
  }
  if(column=='S'){
    return await select(`SELECT * FROM Server`);
  }
}

export async function select_User(column: string) {
  return await select(`SELECT ${column} FROM User`);
}

const db = {select, selecta, select_User};
export default db;