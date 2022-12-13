const router = require('express').Router();

const notFound = require('../middleware/notFoundHandler');
const {transactionChecker, moreTransactionChecker,apiLastTransaction,apiMoreTransaction} = require('../controllers/controllers');

router.get('/last', transactionChecker);
router.get('/most', moreTransactionChecker);
router.get('/apilast', apiLastTransaction);
router.get('/apimost', apiMoreTransaction);
router.use('*', notFound);

module.exports = router;