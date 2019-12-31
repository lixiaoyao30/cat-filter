import * as config from './config.json'

import { App } from './App'

// create app
const app = new App(config)

// startup app
app.start()
