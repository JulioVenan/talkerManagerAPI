const validateToken = (request, response, next) => {
    const { authorization } = request.headers;
    if (!authorization) {
        return response.status(401).json({ message: 'Token não encontrado' });
    }
    if (authorization.length !== 16) {
        return response.status(401).json({ message: 'Token inválido' });
    }
    next();
};

function validateName(request, response, next) {
    const { name } = request.body;
    if (!name) {
      return response.status(400).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < 3) {
      return response.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
    next();
  }

  function validateAge(request, response, next) {
    const { age } = request.body;
    const MIN_AGE = 18;
    if (!age) {
      return response.status(400).json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < MIN_AGE) {
      return response.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
    }
    next();
  }

  function validateTalk(request, response, next) {
    const { talk } = request.body;
    const dateFormat = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!talk) {
      return response.status(400).json({ message: 'O campo "talk" é obrigatório' });
    }
    if (!talk.watchedAt) {
      return response.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    }
    if (!dateFormat.test(talk.watchedAt)) {
      return response.status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
    if (talk.rate === undefined) {
      return response.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
    next();
  }
  
  const validateExistingRate = (rate) => {
    if (!rate && typeof rate !== 'number') {
        return true;
    }
  };

  function validateRate(request, response, next) {
    const { talk: { rate } } = request.body;
    if (validateExistingRate(rate)) {
      return response.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
    if ((Number(rate) < 1 || Number(rate) > 5) || !Number.isInteger(rate)) {
      return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
    next();
  }

  module.exports = {
    validateToken,
    validateName,
    validateAge,
    validateTalk,
    validateRate,
  };