const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { parse } = require('csv-parse');

// SQLite database setup
const db = new sqlite3.Database('banco.db');

// Create a table for Aluno data
db.run(`
  CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    matricula TEXT NOT NULL,
    data_nascimento DATE,
    endereco TEXT,
    email TEXT NOT NULL UNIQUE
  )
`);

// Create a table for Disciplina data
db.run(`
  CREATE TABLE IF NOT EXISTS disciplinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    codigo TEXT NOT NULL UNIQUE,
    carga_horaria INTEGER NOT NULL,
    professor TEXT
  )
`);

// Function to insert records into the Aluno table
function insertAlunoRecords(records) {
  records.forEach(record => {
    const { nome, matricula, data_nascimento, endereco, email } = record;
    db.run(
      'INSERT INTO alunos (nome, matricula, data_nascimento, endereco, email) VALUES (?, ?, ?, ?, ?)',
      [nome, matricula, data_nascimento, endereco, email],
      err => {
        if (err) {
          console.error('Error inserting Aluno record:', err);
        } else {
          console.log('Aluno record inserted successfully');
        }
      }
    );
  });
}

// Function to insert records into the Disciplina table
function insertDisciplinaRecords(records) {
  records.forEach(record => {
    const { nome, codigo, carga_horaria, professor } = record;
    db.run(
      'INSERT INTO disciplinas (nome, codigo, carga_horaria, professor) VALUES (?, ?, ?, ?)',
      [nome, codigo, carga_horaria, professor],
      err => {
        if (err) {
          console.error('Error inserting Disciplina record:', err);
        } else {
          console.log('Disciplina record inserted successfully');
        }
      }
    );
  });
}

// Read and parse the CSV files
const alunosCsvData = fs.readFileSync('alunos.csv', 'utf8');
const disciplinasCsvData = fs.readFileSync('disciplinas.csv', 'utf8');

const alunosRecords = parse(alunosCsvData, { columns: true });
const disciplinasRecords = parse(disciplinasCsvData, { columns: true });

// Insert records into the Aluno and Disciplina tables
insertAlunoRecords(alunosRecords);
insertDisciplinaRecords(disciplinasRecords);

// Close the database connection when done
db.close();
