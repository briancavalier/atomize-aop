define({

	// Create a component instance
	component: {
		create: 'component',

		// Call updateValue after component has been wired
		ready: 'updateValue',

		// Setup transactional methods using a simple regex match
		transactional: /updateValue/,

		// Brute force add some around advice to render the result
		// of the transaction
		afterResolving: {
			'updateValue': 'renderResult'
		},
		// Connect a click handler to the button (see view below)
		on: {
			view: { 'click:button': 'updateValue' }
		}
	},

	// Quick and dirty use wire/dom/render to pop something
	// useful into the DOM
	view: {
		render: '<div><p>Value: <span class="value"></span></p><button>+1</button></div>',
		insert: { first: { $ref: 'dom.first!body'} },
	},

	// Logging advice
	renderResult: {
		create: {
			module: 'renderResult',
			// Inject a reference to the atomize-managed data we want to log
			args: { $ref: 'dom.first!.value', at: 'view' }
		}
	},

	// wire plugins
	plugins: [
		// Debug -- see the browser console
		{ module: 'wire/debug' },
		{ module: 'wire/dom' },
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		// Quick and dirty atomize plugin for wire that starts atomize
		// and provides access to an atomize instance and the shared root
		// via a wire reference resolver (see usage of "atomize!" above)
		{ module: 'lib/atomize-wire', logging: true },
		// Bring in wire/aop for afterResolving advice
		{ module: 'wire/aop' }
	]
});