import { Router } from 'express';
import Beer from '../models/beer'

let router = Router();

// http://localhost:8080/api/beers
router.route('/')
	.post((req, res) => {

		let beer = new Beer({			
			name: 	   req.body.name,
			brewery:   req.body.brewery,
			size: 	   req.body.size,
			alcoholic: req.body.alcoholic
		})

		beer.save((err, savedBeer) => {
			if (err) res.status(500).send(err);
			res.status(201).json(savedBeer);
		})
	})

	.get((req, res) => {
		Beer.find((err, beers) => {
			if (err) res.status(500).send(err);
			res.status(200).json({
				"count":   beers.length,
				"results": beers
			})
		})
	})

router.route('/:id')
	.get((req, res) => {
		let beerId = req.params.id // vi kan aksessere URL parametere på req.params objektet
		Beer.findById(beerId, (err, beer) => {
			if (err) res.status(500).send(err);
			res.status(200).json(beer);
		})
	})

	.put((req, res) => {
		let beerId = req.params.id
		Beer.findById(beerId, (err, beer) => {
			if (err) res.status(500).send(err);
			let beer = {}
			let { beer.name, beer.brewery, beer.size, beer.alcoholic } = req.body

			beer.save((err) => {
				if (err) res.status(500).send(err);
				res.status(204).json(beer)
			})
		})
	})

	.delete((req, res, next) => {
		let beerId = req.params.id
        Beer.findByIdAndRemove(beerId, (err, beer) => {
            if (err) res.status(500).send(err);
            res.status(204).json(beer);
        })
    })

module.exports = router;