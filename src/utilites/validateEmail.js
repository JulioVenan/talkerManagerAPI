const validateEmail = (reqs, res, next) => {
    const isFormartEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!reqs.body.email) {
        return (res.status(400).json({ message: 'O campo "email" é obrigatório' }));
    }
    if (!isFormartEmail.test(reqs.body.email)) {
        return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    next();
};

module.exports = validateEmail;