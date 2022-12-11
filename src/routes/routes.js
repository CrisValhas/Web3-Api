const router = require('express').Router();

const notFound = require('../middleware/notFoundHandler');
const {transactionChecker,moreTransactionChecker} = require('../controllers/controllers');

router.get('/last', transactionChecker);
router.get('/most', moreTransactionChecker);
router.use('*', notFound);

module.exports = router;