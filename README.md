# Hidden Figures in Physics and Astronomy Database

<p align="center">
  <!-- <img src="assets/img/logos/hiddenfigs_logo.png" alt="Hidden Figures" width="400"/> -->
</p>

A resource to highlight the contributions of physicists and astronomers from marginalized backgrounds.

## License

All content copyright Hidden Figures in Physics and Astronomy. Code available under the MIT license.

## Installation

Project requires Yarn and Hugo. See netlify.toml file for Node and Hugo versions.

To setup, run `yarn`.

To build the search index, run `yarn pagefind-dev`.

To develop locally, run `hugo serve` and open a web browser to http://localhost:1313/.

## Architecture

Site search is powered by [PageFind](https://pagefind.app/). Before deploy, a search index is built at /public/pagefind/. During development, the search files are copied to /static/pagefind/, which is not synchronized to Git.

Email addresses are Base64 encoded to prevent casual scraping.

The site was not made with reuse in mind, but it hasn't been so hard. Just rip out the content files, rewrite nav.html and footer.html and change the base URL in config.toml.

## Tips and notes

1. Sometimes the script won't apply. This is due to the browser cache, run it in guest or incognito or clear cache
2. Any pagefind related change/content change needs to run `yarn pagefind-dev` to load
3. run `prettier docs package.json "{app,__{tests,mocks}__}/**/*.js" --write --single-quote --trailing-comma all` before you push
4. run `yarn test` before push to the main branch to ensure proper deployment
4. If you see expert, expertise, location, it is not related to this project
5. The main folders: layouts, assets/js, contents and all the configs and yml(website building) files. 
