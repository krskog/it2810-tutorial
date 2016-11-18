import { Router } from 'express';

let router = Router();

router.get('/', (req, res) => {
	res.status(200).json({
		message: "Hooray! Our API works!"
	})
})

module.exports = router;

