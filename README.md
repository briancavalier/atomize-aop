1. Clone the repo
1. cd <repo dir>
1. `git submodule init && git submodule update`
1. `npm install atomize-server express`
1. `sh bin/server`
1. Point several browser tabs at [localhost:9999](http://localhost:9999/).  Watch the numbers and the browser console.  Reload tabs at will.
	* **IMPORTANT** You have to use a browser that supports ES Harmony Proxies.  Currently, that includes:
		* Firefox 12
		* Chrome 19 but you have to enable it in chrome://flags - Look for "Experimental Javascript", or start chrome on the command line with `--harmony`