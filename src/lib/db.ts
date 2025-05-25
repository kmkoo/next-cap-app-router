import dbi from './dbcon';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * SQL SELECT 쿼리 실행 (RowDataPacket[] 반환)
 * @param sql 실행할 SELECT 문 (예: "SELECT userNumber, userName FROM User")
 * @param params 바인딩할 파라미터 배열 (예: [1, '홍길동'])
 */
async function selectQuery(
  sql: string,
  params: unknown[] = []
): Promise<RowDataPacket[]> {
  const [rows] = await dbi.query<RowDataPacket[]>(sql, params);
  return rows;
}

/**
 * SQL INSERT/UPDATE/DELETE 쿼리 실행 (ResultSetHeader 반환)
 * @param sql 실행할 변경 쿼리 문 (예: "UPDATE User SET userName = ? WHERE userNumber = ?")
 * @param params 바인딩할 파라미터 배열 (예: ['홍길동', 1])
 */
async function modifyQuery(
  sql: string,
  params: unknown[] = []
): Promise<ResultSetHeader> {
  const [result] = await dbi.query<ResultSetHeader>(sql, params);
  return result;
}

/**
 * 칼럼에 들어가는 값 유저 테이블에서 검색
 * @param column 조회할 컬럼 명 (예: 'userNumber, userName, userEmail')
 */
export async function select_User(
  column: string
): Promise<RowDataPacket[]> {
  return selectQuery(`SELECT ${column} FROM User`);
}

/**
 * 칼럼에 들어가는 값 서버 테이블에서 검색
 * @param column 조회할 컬럼 명 (예: 'serverNumber, serverName, status')
 */
export async function select_Server(
  column: string
): Promise<RowDataPacket[]> {
  return selectQuery(`SELECT ${column} FROM Server`);
}

/**
 * 유저 테이블에 새 레코드 삽입
 * @param columns 삽입할 칼럼 명 (예: 'userNumber, userName, userEmail, userPassword')
 * @param values 칼럼 순서에 맞춘 값 배열 (예: [42, '김철수', 'chulsoo@x.com', 'pass123'])
 */
export async function insert_User(
  columns: string,
  values: unknown[]
): Promise<ResultSetHeader> {
  const placeholders = values.map(() => '?').join(',');
  return modifyQuery(
    `INSERT INTO User (${columns}) VALUES (${placeholders})`,
    values
  );
}

/**
 * 서버 테이블에 새 레코드 삽입
 * @param columns 삽입할 칼럼 명 (예: 'serverNumber, userNumber, serverName, serverAddr, serverType, status')
 * @param values 칼럼 순서에 맞춘 값 배열 (예: [7, 42, 'TestServer', '10.0.0.5', 't2.micro', 'active'])
 */
export async function insert_Server(
  columns: string,
  values: unknown[]
): Promise<ResultSetHeader> {
  const placeholders = values.map(() => '?').join(',');
  return modifyQuery(
    `INSERT INTO Server (${columns}) VALUES (${placeholders})`,
    values
  );
}

/**
 * 유저 테이블 레코드 수정
 * @param setClause SET 절 (예: 'userName = ?, userEmail = ?')
 * @param values SET 절에 바인딩할 값 배열 (예: ['최영희', 'younghee@x.com'])
 * @param keyColumn WHERE 절 기준 키 컬럼 명 (예: 'userNumber')
 * @param keyValue WHERE 절 기준 키 값 (예: 42)
 */
export async function update_User(
  setClause: string,
  values: unknown[],
  keyColumn: string,
  keyValue: unknown
): Promise<ResultSetHeader> {
  return modifyQuery(
    `UPDATE User SET ${setClause} WHERE ${keyColumn} = ?`,
    [...values, keyValue]
  );
}

/**
 * 서버 테이블 레코드 수정
 * @param setClause SET 절 (예: 'status = ?, serverType = ?')
 * @param values SET 절에 바인딩할 값 배열 (예: ['inactive', 't3.small'])
 * @param keyColumn WHERE 절 기준 키 컬럼 명 (예: 'serverNumber')
 * @param keyValue WHERE 절 기준 키 값 (예: 7)
 */
export async function update_Server(
  setClause: string,
  values: unknown[],
  keyColumn: string,
  keyValue: unknown
): Promise<ResultSetHeader> {
  return modifyQuery(
    `UPDATE Server SET ${setClause} WHERE ${keyColumn} = ?`,
    [...values, keyValue]
  );
}

/**
 * 유저 테이블 레코드 삭제
 * @param keyColumn WHERE 절 기준 키 컬럼 명 (예: 'userNumber')
 * @param keyValue WHERE 절 기준 키 값 (예: 42)
 */
export async function deletee_User(
  keyColumn: string,
  keyValue: unknown
): Promise<ResultSetHeader> {
  return modifyQuery(
    `DELETE FROM User WHERE ${keyColumn} = ?`,
    [keyValue]
  );
}

/**
 * 서버 테이블 레코드 삭제
 * @param keyColumn WHERE 절 기준 키 컬럼 명 (예: 'serverNumber')
 * @param keyValue WHERE 절 기준 키 값 (예: 7)
 */
export async function deletee_Server(
  keyColumn: string,
  keyValue: unknown
): Promise<ResultSetHeader> {
  return modifyQuery(
    `DELETE FROM Server WHERE ${keyColumn} = ?`,
    [keyValue]
  );
}

export default {
  select_User,
  select_Server,
  insert_User,
  insert_Server,
  update_User,
  update_Server,
  deletee_User,
  deletee_Server,
};
