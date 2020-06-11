const express = require('express');
const postDB = require('./postDb');

const router = express.Router();

router.get('/', (request, response) => {
  try {
    postDB.get().then((response) => response.send(response));
  } catch {
    response.status(500).json({ error: 'an error has occurred' });
  }
});

router.get('/:id', validatePostId, (request, response) => {
  const id = request.params.id;
  try {
    postDB.getById(id).then((response) => response.send(response));
  } catch {
    response.status(500).json({ error: 'an error has occurred' });
  }
});

router.delete('/:id', validatePostId, (request, response) => {
  const id = request.params.id;
  try {
    postDB
      .remove(id)
      .then((response) => response.status(204).send({ success: response }));
  } catch {
    response.status(500).json({ error: 'an error has occurred' });
  }
});

router.put('/:id', validatePostId, validatePost, (request, response) => {
  const id = request.params.id;
  try {
    const postUpdate = {
      text: request.body.text,
    };
    postDB
      .update(id, postUpdate)
      .then((response) => response.status(204).send({ success: response }));
  } catch {
    response.status(500).json({ error: 'an error has occurred' });
  }
});

// custom middleware

function validatePostId(request, response, next) {
  const id = request.params.id;
  postDB.getById(id).then((response) => {
    if (response) {
      next();
    } else {
      response.status(400).json({ message: 'invalid post id' });
    }
  });
}

function validatePost(request, response, next) {
  if (request.body.text) {
    next();
  } else {
    response.status(400).json({ message: 'missing required text field' });
  }
}

module.exports = router;