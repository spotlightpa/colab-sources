# Amplify Colorado Diverse Sources Database

A resource for Colorado journalists to improve representation and diversify perspectives in their coverage.

Project forked from https://github.com/spotlightpa/sourcesdb and https://github.com/spotlightpa/ctmirror-sources. See original project for details about creation and architecture.

## License

All content copyright Colorado News Collective. Code available under the MIT license. Photos used with permission of subjects. Information contained in this database is self-reported by participants and should be verified before publication.

## Installation

Project requires Yarn and Hugo. See netlify.toml file for Node and Hugo versions.

To setup, run `yarn`.

To build the search index, run `yarn pagefind-dev`.

To develop locally, run `hugo serve` and open a web browser to http://localhost:1313/.

## Architecture

Site search is powered by [PageFind](https://pagefind.app/). Before deploy, a search index is built at /public/pagefind/. During development, the search files are copied to /static/pagefind/, which is not synchronized to Git.

Email addresses are Base64 encoded to prevent casual scraping.

The site was not made with reuse in mind, but it hasn't been so hard. Just rip out the content files, rewrite nav.html and footer.html to remove references to Spotlight PA or Colorado, and change the base URL in config.toml. Contact webmaster@spotlightpa.org with questions.
