const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'banco.db', 
});


const Aluno = sequelize.define('Aluno', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data_nascimento: {
    type: DataTypes.DATEONLY, 
  },
  endereco: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  tableName: 'alunos',
  timestamps: false,
});


const Disciplina = sequelize.define('Disciplina', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  carga_horaria: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  professor: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'disciplinas',
  timestamps: false,
});


sequelize.sync().then(() => {
  console.log('Database and tables synced.');
});


app.use(express.json());

app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.json(alunos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/alunos', async (req, res) => {
  try {
    const aluno = await Aluno.create(req.body);
    res.json(aluno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno not found' });
    }
    res.json(aluno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/alunos/:id', async (req, res) => {
  try {
    const [rowsUpdated, [updatedAluno]] = await Aluno.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (rowsUpdated === 0) {
      return res.status(404).json({ error: 'Aluno not found' });
    }
    res.json(updatedAluno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/alunos/:id', async (req, res) => {
  try {
    const rowsDeleted = await Aluno.destroy({ where: { id: req.params.id } });
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'Aluno not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/disciplinas', async (req, res) => {
  try {
    const disciplinas = await Disciplina.findAll();
    res.json(disciplinas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/disciplinas', async (req, res) => {
  try {
    const disciplina = await Disciplina.create(req.body);
    res.json(disciplina);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/disciplinas/:id', async (req, res) => {
  try {
    const disciplina = await Disciplina.findByPk(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ error: 'Disciplina not found' });
    }
    res.json(disciplina);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/disciplinas/:id', async (req, res) => {
  try {
    const [rowsUpdated, [updatedDisciplina]] = await Disciplina.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (rowsUpdated === 0) {
      return res.status(404).json({ error: 'Disciplina not found' });
    }
    res.json(updatedDisciplina);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/disciplinas/:id', async (req, res) => {
  try {
    const rowsDeleted = await Disciplina.destroy({ where: { id: req.params.id } });
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'Disciplina not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
