# NETWORK HELL

In Network Hell, you play the role of a request traveling back up the [OSI Stack](https://en.wikipedia.org/wiki/OSI_model) to try and connect to the outside world. Move quickly and pickup packets along the way to provide data to your consumer with the least response time.

## Objective
Make your way to the end of the maze as fast as possible. You may pick up objectives on your way. Finishing the level earlier will yield a higher score multiplier.

## Controls
__Desktop:__ Use `w` `a` `s` `d` or arrow keys

__Mobile:__ Use gyroscope (works best with screen orientation locked to portrait)

## Team
__Zack Urben:__ [GitHub](github.com/zackurben), [Twitter](twitter.com/zackurben)

__Jonathan Darling:__ [GitHub](github.com/jmdarling)

# Tech Details

This is an open source project under the MIT license, see [LICENSE.md](LICENSE.md) for additional information.

## Usage
```bash
git clone https://github.com/zackurben/js13k-2018.git my-project
```

## Development
```bash
# terminal 1
npm run mobile

# terminal 2
npm start

# profit ?!
```

## Included Scripts

### dev-server
  `npm run dev-server`

  Start the webpack dev server and watch for any file changes. This will open your default browser to `https://js13k.localtunnel.me/`.

### lint
  `npm run lint` 
  
  Format the codebase with _prettier_.

### test
  `npm test`
  
  Run the tests with _jest_.

### watch
  `npm run watch`
  
  Watch code changes to trigger new webpack builds.

### start
  `npm start`

  Start localtunnel and start the webpack dev server and watch for any file changes. This will open your default browser to `https://js13k.localtunnel.me/`.

### build
  `npm run build`

  Build the production dist files for the js bundle.

### mobile
  `npm run mobile`

  Start localtunnel for development.

## Contact
  - Zack Urben
    - Twitter: https://twitter.com/zackurben (better)
    - Contact: zackurben@gmail.com
