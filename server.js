// server.js

// Importerer moduler
import express 		from 'express';
import bodyParser 	from 'body-parser';
import mongoose		from 'mongoose';
import routes		from './routes/index'
import beers		from './routes/beers';

const app 	= express();
const port  = process.env.PORT || 8080
mongoose.connect('mongodb://localhost:27017/beer-app')

// Middlewares here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Configuring routes
app.use('/', routes)
app.use('/api/beers', beers)

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
