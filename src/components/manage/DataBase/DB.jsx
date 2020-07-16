import axios from 'axios';

class DB {
  static table(path, tableName) {
    return new Table(path, tableName);
  }
}

class Table {
  constructor(path, tableName) {
    this.path = path;
    this.tableName = tableName;
    this.method = '';
    this.query = '';
    this.whereStatements = [];
  }
  get() {
    this.query += `SELECT * FROM ${this.tableName} `;
    this.method = 'get';
    return this;
  }
  where(column, value) {
    if (Array.isArray(value)) {
      value.forEach(v => {
        this.whereStatements.push(`WHERE ${column}='${v}'`);
      });
    } else if (value) {
      value.split(',').forEach(v => {
        this.whereStatements.push(`WHERE ${column}='${v}'`);
      });
    }
    return this;
  }
  log() {
    console.log(this.query + this.whereStatements.join(' AND '));
    return this.query + this.whereStatements.join(' AND ');
  }
  makeRequest() {
    return axios[this.method](`${this.path}?query=${this.query}`);
  }
}

export default DB;
